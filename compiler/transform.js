
const print = require('./print')
const logger = require('./logger')()
const emitter = require('./emitter')

let document = null
let system = null
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
	node.on = emitter.on
	node.once = emitter.once
	node.emit = emitter.emit
	node.emit('enter')
	iterate(node.value, function(each, index_) {
		walk(each, index_, parents, state)
	})
	node.emit('exit')
	parents.pop(node)
}

function iterate(array, func) {
	
	let index = 0
	system.bus.on('node.inserted', function(node, index_) {
		if (index_ <= index) index++
	})
	system.bus.on('node.removed', function(node, index_) {
		if (index_ <= index) index--
	})
	for (index = 0; index < array.length; index++) {
		let result = func(array[index], index)
		if (result === false) break
	}
}

function atoms(node, index, parents, state) {
	
	node.on = emitter.on
	node.once = emitter.once
	node.emit = emitter.emit
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

module.exports = function(document_, system_) {
	
	document = document_
	system = system_
	return {
		transform,
		walk
	}
}
