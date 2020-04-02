
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'and',
		
		enter : function(node, index, parents, state) {
			
			operator.infix('operator_and', precedence, node, index, parents, state)
		}
	}
}
