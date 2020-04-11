
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'greater',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.objectify ? 'operator_greater_object' : 'operator_greater'
			operator.infix(instruction, precedence, node, index, parents, state)
		}
	}
}
