
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'symbol',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'symbol')) return
			parent.once('exit', function() {
				return
			})
		}
	}
}
