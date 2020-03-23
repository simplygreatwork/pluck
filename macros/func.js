
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared.js')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'func',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'func')) return
			if (! query.is_expression_longer(parent, 1)) return
			if (! query.is_type(parent.value[1], 'symbol')) return
			if (! parent.value[1].value) return
			state.func = parent
			state.locals = shared.find_locals(state)
			parent.value[1].value = shared.dollarize(parent.value[1].value)
			parent.once('exit', function() {
				state.func = null
			})
		}
	}
}
