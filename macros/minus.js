
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'minus',
		
		enter : function(node, index, parents, state) {
			
			operator.infix('i32.sub', precedence, node, index, parents, state)
		}
	}
}
