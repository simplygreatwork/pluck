
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'function',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'function')) return
			if (! (index === 0)) return
			let parts = parts_(parent.value[1].value, document)
			let id = system.table.find_function_id(parts.module, parts.func)
			let signature = system.table.find_function(parts.module, parts.func).value
			if (id && signature) {
				let func_name = function_embed(parents[0], index, parents, state, id, signature, system, document)
				let tree = parse(` (call ${func_name})`)[0]
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					query.replace(parent, parent.value[index], tree)
				})
			} else {
				console.error('')
				console.error(`>>>>> Unable to find function "${parts.func}" or module "${parts.module}" <<<<<`)
				console.error('')
				process.exit(1)
			}
		}
	}
}

function parts_(path_, document) {
	
	let result = {}
	let array = path_.split('/')
	if (array.length == 1) {
		result.module = document.id
		result.func = shared.dollarize(array[0])
	} else {
		result.func = shared.dollarize(array.pop())
		result.module = array.join('/')
	}
	return result
}

function function_embed(node, index, parents, state, id, signature, system, document) {
	
	let func_name = '$signature_static_' + (++system.string_counter)
	let ast = parse(
		`\n\n\t(func ${func_name} (result i32)
		\n\t\t(local $function i32)
		\n\t\t(local $signature i32)
		\n\t\t(set_local $signature (call $list_new))
		\n\t\t${get_signature_result(signature)}
		\n\t\t${get_signature_params(signature)}
		\n\t\t(call $function_new (i32.const ${id}) (get_local $signature))
		\n)
	`)[0]
	document.walk(ast, 0, parents, {})
	query.append(node, ast)
	return func_name
}

function get_signature_result(signature) {
	
	let result = signature
	.filter(function(each, index) {
		return each.type == 'expression' && each.value[0].value == 'result'
	})
	.map(function(each, index) {
		return `\t\t(call $list_append (get_local $signature) (string "${each.value[1].value}"))\n`
	})
	if (result.length === 0) result.push(`\t\t(call $list_append (get_local $signature) (string "void"))\n`)
	return result.join('')
}

function get_signature_params(signature) {
	
	let result = signature
	.filter(function(each, index) {
		return each.type == 'expression' && each.value[0].value == 'param'
	})
	.map(function(each, index) {
		return `\t\t(call $list_append (get_local $signature) (string "${each.value[2].value}"))\n`
	})
	if (result.length === 0) result.push(`\t\t(call $list_append (get_local $signature) (string "void"))\n`)
	return result.join('')
}
