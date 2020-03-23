
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'export')) return
			if (! query.is_type_value(node.value[1], 'symbol', 'all')) return
			query.remove(parents[0], node)
		}
	}
}
