
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
				if (query.is_type(parent.value[1], 'string')) {
					query.climb(parents, function(node, index, parents) {
						let parent = query.last(parents)
						index = query.remove(parent, node)
						parent.emit('node.removed', index)
					})
				}
			})
		}
	}
}
