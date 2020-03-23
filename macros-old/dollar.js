
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {
			
			if (! query.is_type(node, 'expression')) return
			if (query.is_type_value(node.value[0], 'symbol', 'call')) {
				rewrite(node.value[1], index, parents, state, document)
			} else if (query.is_type_value(node.value[0], 'symbol', 'funcref')) {
				rewrite(node.value[1], index, parents, state, document)
			} else {
				rewrite(node.value[0], index, parents, state, document)
			}
		}
	}
}

function rewrite(node, index, parents, state, document) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = shared.dollarize(node.value)
	} else {
		if (! shared.is_inside_function(state)) return
		if (! shared.is_local(state, node.value)) return
		node.value = shared.dollarize(node.value)
	}
}
