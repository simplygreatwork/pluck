
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared.js')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'call')) {
				dollarize(parent.value[1], state, document)
			} else if (query.is_type_value(node.value[0], 'symbol', 'funcref')) {
				dollarize(parent.value[1], state, document)
			} else {
				dollarize(parent.value[0], state, document)
			}
		}
	}
}

function dollarize(node, state, document) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = shared.dollarize(node.value)
	} else {
		if (! shared.is_inside_function(state)) return
		if (! shared.is_local(state, node.value)) return
		node.value = shared.dollarize(node.value)
	}
}
