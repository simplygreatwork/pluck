
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'equals',
		
		enter : function(node, index, parents, state) {
			
			operator.infix('i32.eq', precedence, node, index, parents, state)
		}
	}
}
