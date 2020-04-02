
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'greater',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.use_number_objects ? 'operator_greater' : 'operator_greater_primitive'
			operator.infix(instruction, precedence, node, index, parents, state)
		}
	}
}
