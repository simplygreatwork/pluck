
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'false',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node, 'symbol', 'false')) return
			parent.value[index] = parse(` (call $boolean_new (i32.const 0))`)[0]
			if (false) parent.value[index] = parse(` (call $object_boolean_from_number_primitive (i32.const 0))`)[0]
		}
	}
}
