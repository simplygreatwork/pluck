
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! shared.is_inside_function(state)) return
	if (query.is_type_value(node.value[0], 'symbol', 'set')) {
		node.value[0].value = 'set_local'
	}
	if (! query.is_type_value(node.value[0], 'symbol', 'set_local')) return
	node.value[1].value = shared.dollarify(node.value[1].value)
	if (query.is_expression_longer(node, 2)) {
		if (query.is_type_value(node.value[2], 'symbol', 'to')) {
			query.remove(node, node.value[2])
		}
	}
	return declare(node.value[1].value, parents, state)
}

function declare(value, parents, state) {
	
	let found = shared.is_local(state, value)
	if (! found) {
		let tree = parse (`
		(local ${value} i32)
		`)[0]
		query.insert(state.func, tree, state.locals.offset)
		system.fire('insert', tree)
		state.locals = shared.find_locals(state)
	}
	return (! found) ? false : undefined
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}