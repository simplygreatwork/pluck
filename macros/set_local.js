
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'set_local',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'set_local')) return
			parent.value[1].value = shared.dollarize(parent.value[1].value)
			shared.declare(parent.value[1].value, state)
			if (false) return		// below for: "set list to List clone" instead of "set list to (List clone)""
			if (query.is_type(parent.value[2], 'expression')) return
			let expression = parse(` ()`)[0]
			expression.value = parent.value.splice(2, parent.value.length - 2)
			parent.value[2] = expression
			parent.index = 0
			parent.length = 3
		}
	}
}
