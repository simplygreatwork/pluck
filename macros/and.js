
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'and',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.objectify ? 'operator_and_object' : 'operator_and'
			operator.infix(instruction, precedence, node, index, parents, state)
		}
	}
}
