
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'equals',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.objectify ? 'operator_equals_object' : 'operator_equals'
			operator.infix(instruction, precedence, node, index, parents, state)
		}
	}
}
