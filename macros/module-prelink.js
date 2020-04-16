
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'module',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'module')) return
		}
	}
}
