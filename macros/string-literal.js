
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'string',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'string')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'string')) return
			let string = node.value
			let func_name = shared_string.function_new(parents[0], string, system, true)
			let tree = parse(` (call ${func_name})`)[0]
			parent.value[index] = tree
		}
	}
}
