
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (query.is_type_value(node.value[0], 'symbol', 'call')) {
		rewrite(node.value[1], index, parents, state)
	} else if (query.is_type_value(node.value[0], 'symbol', 'funcref')) {
		rewrite(node.value[1], index, parents, state)
	} else {
		rewrite(node.value[0], index, parents, state)
	}
}

function rewrite(node, index, parents, state) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = shared.dollarify(node.value)
	} else {
		if (! shared.is_inside_function(state)) return
		if (! shared.is_local(state, node.value)) return
		node.value = shared.dollarify(node.value)
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}