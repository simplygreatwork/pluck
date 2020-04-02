
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'or',
		
		enter : function(node, index, parents, state) {
			
			operator.infix('operator_or', precedence, node, index, parents, state)
		}
	}
}
