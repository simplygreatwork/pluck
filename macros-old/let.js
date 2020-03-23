
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (query.is_type_value(node.value[0], 'symbol', 'let')) {
				return
			}
		}
	}
}
