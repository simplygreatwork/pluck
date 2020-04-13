
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const operator = require('./operator')

module.exports = function(system, document, precedence) {
	
	return {
		
		type: 'symbol',
		value: 'not',
		
		enter : function(node, index, parents, state) {
			
			let instruction = system.objectify ? 'operator_not_object' : 'operator_not'
			operator.prefix(instruction, precedence, node, index, parents, state, system)
		}
	}
}
