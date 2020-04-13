
const path = require('path')
const jetpack = require('fs-jetpack')
const remark = require('remark')
const visit = require('unist-util-visit')
const parse = require('./parse')
const walk = require('./walk')
const query = require('./query')
const logger = require('./logger')()
const broadcast = require('./broadcast')
const Transform = require('./transform')

function process_md(document) {
	
	let result = []
	let tree = remark().parse(document.source)
	visit(tree, function(node) {
		if (node.type == 'code') {
			result.push('\n')
			result.push(node.value)
		}
	}.bind(this))
	document.source = result.join('')
}

function process_watm(document) {
	
	let result = parse(document.source, 'implicit')
	if (result.error) {
		let line_result = find_line(document, result.position)
		console.error('Error parsing line ' + line_result.line + ' at character ' + line_result.char + ':')
		console.error('--> ' + line_result.text)
		console.error('')
		process.exit(1)
		return false
	} else {
		document.tree = result
		broadcast.emit('parsed', document.id)
	}
}

function find_line(document, position) {
	
	let result = {}
	let a = document.source.indexOf('\n', position)
	let b = document.source.lastIndexOf('\n', a - 1)
	result.text = document.source.substring(b + 1, a)
	result.line = document.source.substring(0, b).split('\n').length
	result.char = position - b
	return result
}

function transform(system, document, macros) {
	
	let transform = new Transform(system, document)
	document.walk = transform.walk.bind(transform)
	transform.transform(macros)
}

function link(document) {
	
	document.functions = find_functions(document)
	document.function_exports = find_function_exports(document)
	render_function_exports(document)
	document.function_imports = find_function_imports(document)
	document.module_imports = find_module_imports(document)
}

function compile(document) {
	
	try {
		let module_ = require('wabt')().parseWat(document.path, document.source, this.flags = {
			exceptions : false,
			mutable_globals : true,
			sat_float_to_int : false,
			sign_extension : false,
			simd : false,
			threads : false,
			multi_value : false,
			tail_call : false
		})
		module_.resolveNames()
		module_.validate(this.flags)
		return module_.toBinary({
			log: false,
			write_debug_names: false
		})
	} catch (error) {
		console.error('')
		console.error('>>>>> Wasm text compilation failed in wabt.js with document: ' + document.id + ' <<<<<')
		console.error('')
		console.error(error)
		console.error('')
		console.error('Exiting now.')
		console.error('')
		process.exit(1)
	}
}

function instantiate(document, imports) {
	
	let wasm = new WebAssembly.Module(document.wasm)
	document.instance = new WebAssembly.Instance(wasm, imports)
	return document.instance.exports
}

function find_module_imports(document) {
	
	let result = []
	walk({ root: document.tree[0], enter: function(node, index, parents) {
		if (! query.is_type(node, 'expression')) return
		if (query.is_length(node, 2)) {
			if (query.is_type_value(node.value[0], 'symbol', 'import')) {
				if (query.is_type(node.value[1], 'string')) {
					result.push(jetpack.path(document.path, '..', node.value[1].value))
				}
			}
		}
	}})
	return result
}

function find_function_imports(document) {
	
	let result = {}
	walk({ root: document.tree[0], enter: function(node, index, parents) {
		if (! query.is_type(node, 'expression')) return
		if (query.is_depth(parents, 1)) {
			if (node.value.length > 2) {
				if (query.is_type_value(node.value[0], 'symbol', 'import')) {
					let module = node.value[1].value
					let func = node.value[2].value
					result[module] = result[module] || {}
					result[module][func] = node
				}
			}
		}
	}})
	return result
}

function find_functions(document) {
	
	let result = []
	walk({ root: document.tree[0], enter: function(node, index, parents) {
		if (! query.is_type(node, 'expression')) return
		if (query.is_depth(parents, 1)) {
			if (query.is_type(node, 'expression')) {
				if (query.is_type_value(node.value[0], 'symbol', 'func')) {
					result.push(node)
				}
			}
		}
	}})
	return result
}

function find_function_exports(document) {
	
	let result = {}
	walk({ root: document.tree[0], enter: function(node, index, parents) {
		if (! query.is_type(node, 'expression')) return
		if (query.is_depth(parents, 1)) {
			if (query.is_type(node, 'expression')) {
				if (query.is_type_value(node.value[0], 'symbol', 'export')) {
					result[node.value[2].value[1].value] = node
				}
			}
		}
	}})
	return result
}

function render_function_exports(document) {
	
	document.functions.forEach(function(each) {
		let name = each.value[1].value
		if (! document.function_exports[name]) {
			if (name.charAt(0) != '$') name = '$' + name		// revisit: why this is needed? hack?
			let code = `\n\t(export "${name.substring(1)}" (func ${name}))`
			let tree = parse(code)
			query.append(document.tree[0], tree[0])
		}
	}.bind(this))
}

function render_function_imports(document) {
	
	document.module_imports.forEach(function(document_) {
		document_.functions.forEach(function(func, index) {
			let name = func.value[1].value
			if (! has_function_import(document, document_.id, name.substring(1))) {
				let code = `\n\t(import "${document_.id}" "${name.substring(1)}" (func ${name}))`
				let tree = parse(code)
				let signature = find_function_signature(func)
				signature.forEach(function(node) {
					tree[0].value[3].value.push(node)
				})
				query.insert(document.tree[0], tree[0], 1)
				let module_ = document_.id
				let func_ = name
				let function_imports = document.function_imports
				function_imports[module_] = function_imports[module_] || {}
				function_imports[module_][func_] = tree[0]
			}
		}.bind(this))
	}.bind(this))
}

function has_function_import(document, module, func) {
	
	if (document.function_imports[module]) {
		if (document.function_imports[module][func]) {
			return true
		}
	}
	return false
}

function find_function_signature(func) {
	
	let result = []
	walk({ root: func, enter: function(node, index, parents) {
		if (! query.is_type(node, 'expression')) return
		if (query.is_type_value(node.value[0], 'symbol', 'param')) {
			result.push(node)
		}
		if (query.is_type_value(node.value[0], 'symbol', 'result')) {
			result.push(node)
		}
	}})
	return result
}

function find_document(system, name) {
	
	for (let document of system.set.values()) {
		if (document.id == name) {
			return document
		}
	}
}

function find_function(document, name) {
	
	for (let each of document.functions) {
		if (each.value[1].value == name) {
			return each
		}
	}
}

module.exports = {
	
	process_md,
	process_watm,
	transform,
	link,
	compile,
	instantiate,
	find_module_imports,
	find_function_imports,
	find_functions,
	find_function_exports,
	render_function_exports,
	render_function_imports,
	has_function_import,
	find_function_signature,
	find_document,
	find_function
}
