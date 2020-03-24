
const print = require('./print')
const logger = require('./logger')()
const emitter = require('./emitter')

let system = null
let document = null
let macros = null

function transform() {
	
	macros = {}
	system.macros.forEach(function(macro, precedence) {
		macro = macro(system, document, precedence)
		let key = macro.type + ':' + (macro.value ? macro.value : '')
		macros[key] = macros[key] || []
		macros[key].push(macro)
	})
	let tree = document.tree
	walk(tree[0], 0, [], {})
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function walk(node, index, parents, state) {
	
	if (node.type == 'expression') {
		expressions(node, index, parents, state)
	} else {
		atoms(node, index, parents, state)
	}
}

function expressions(node, index, parents, state) {
	
	parents.push(node)
	install(node)
	node.emit('enter')
	iterate(node, function(each, index_) {
		walk(each, index_, parents, state)
	})
	node.emit('exit')
	node.on('exit', function() {
		if (false) uninstall(node)
	})
	parents.pop(node)
}

function iterate(node, function_) {
	
	node.index = 0
	node.length = node.value.length
	let inserted = node.on('node.inserted', function(index) {
		node.length = node.value.length
		if (index <= node.index) {
			node.index++
		}
	})
	let removed = node.on('node.removed', function(index) {
		node.length = node.value.length
		if (index <= node.index) {
			node.index--
		}
	})
	for (node.index = 0; node.index < node.length; node.index++) {
		let result = function_(node.value[node.index], node.index)
		if (result === false) break
		node.length = node.value.length							// remove this line once counters () have expression scope
	}
	inserted()
	removed()
}

function atoms(node, index, parents, state) {
	
	install(node)
	atom(node, index, parents, state, macros[node.type + ':'])
	atom(node, index, parents, state, macros[node.type + ':' + node.value])
}

function atom(node, index, parents, state, macros) {
	
	if (! macros) return
	macros.forEach(function(macro) {
		if (macro.enter) {
			node.emit('enter')
			macro.enter(node, index, parents, state)
		}
		if (macro.exit) {
			node.emit('exit')
			macro.exit(node, index, parents, state)
		}
	})
}

function install(node) {
	
	node.on = emitter.on
	node.once = emitter.once
	node.emit = emitter.emit
}

function uninstall(node) {
	
	delete node.on
	delete node.once
	delete node.emit
}

module.exports = function(system_, document_) {
	
	document = document_
	system = system_
	return {
		transform,
		walk
	}
}
