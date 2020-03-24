
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'export',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'export')) return
			if (! query.is_type_value(parent.value[1], 'symbol', 'all')) return
			parent.once('exit', function() {
				index = query.remove(parents[0], parent)
				parents[0].emit('node.removed', index)
			})
		}
	}
}
