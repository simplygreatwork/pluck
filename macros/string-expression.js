
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

let string_counter = 0

module.exports = function(system, document) {
	
	return {
		
		exit: function(node, index, parents, state) {
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'string')) return
			let string = node.value[1].value
			let func_name = shared_string.function_new(parents[0], string, system)
			shared_string.string_call(node, index, parents, func_name)
		}
	}
}
