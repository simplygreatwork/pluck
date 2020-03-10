
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! shared.is_inside_function(state)) return
			if (node.type != 'string') return
			let parent = query.last(parents)
			if (query.is_type_value(parent.value[0], 'symbol', 'string')) return 
			if (query.is_type_value(parent.value[0], 'symbol', 'typeof')) return 
			if (query.is_type_value(parent.value[0], 'symbol', 'funcref')) return
			let string = node.value
			let func_name = shared_string.function_new(parents[0], string, system)
			shared_string.string_call(node, index, parents, func_name)
		}
	}
}
