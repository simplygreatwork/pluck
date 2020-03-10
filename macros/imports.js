
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_expression_length(node, 2)) return
			if (! query.is_type_value(node.value[0], 'symbol', 'import')) return
			if (node.value[1].type == 'string') {
				query.remove(parents[0], node)
			}
		}
	}
}
