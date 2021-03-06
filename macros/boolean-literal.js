
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'boolean',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'boolean')) return
			let value = node.value == 'true' ? 1 : 0
			if (system.objectify) {
				parent.value[index] = parse(` (call $object_boolean_from_primitive (i32.const ${value}))`)[0]
			} else {
				parent.value[index] = parse(` (call $boolean_new (i32.const ${value}))`)[0]
			}
		}
	}
}
