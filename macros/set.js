
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'set',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (query.is_type_value(parent.value[0], 'symbol', 'set')) {
				parent.value[0].value = 'set_local'
			}
			if (! query.is_type_value(parent.value[0], 'symbol', 'set_local')) return
			parent.value[1].value = shared.dollarize(parent.value[1].value)
			if (query.is_expression_longer(parent, 2)) {
				if (query.is_type_value(parent.value[2], 'symbol', 'to')) {
					let index_ = query.remove(parent, parent.value[2])
					parent.emit('node.removed', index_)
				}
			}
			return shared.declare(parent.value[1].value, state)
		}
	}
}
