
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'less',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.use_number_objects ? 'operator_less' : 'operator_less_primitive'
			operator.infix(instruction, precedence, node, index, parents, state)
		}
	}
}
