
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'import',
		
		enter : function(node, index, parents, state) {		
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_expression_length(parent, 2)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'import')) return
			parent.once('exit', function() {
				if (parent.value[1].type == 'string') {
					let index_ = query.remove(parents[0], parent)
					system.bus.emit('node.removed', parents[0], index_)
				}
			})
		}
	}
}
