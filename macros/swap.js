
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'swap',
		
		enter : function(node, index, parents, state) {
			
			return
		}
	}
}
