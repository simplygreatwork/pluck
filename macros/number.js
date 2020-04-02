
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'number',
		
		enter : function(node, index, parents, state) {		
			
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'number')) return
			let parent = query.last(parents)
			if (query.is_type_value(parent.value[0], 'symbol', 'i32.const')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'br')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'br_if')) return
			if (system.use_number_objects) {
				parent.value[index] = parse(` (call $number_new (i32.const ${node.value}))`)[0]
			} else {
				parent.value[index] = parse(` (i32.const ${node.value})`)[0]
			}
		}
	}
}
