
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'not',
		
		enter : function(node, index, parents, state) {
			
			operator.prefix('i32.ne', precedence, node, index, parents, state)
		}
	}
}
