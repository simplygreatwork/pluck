
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! shared.is_inside_function(state)) return
			if (node.type != 'number') return
			let parent = query.last(parents)
			if (query.is_type_value(parent.value[0], 'symbol', 'i32.const')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'br')) return
			if (query.is_type_value(parent.value[0], 'symbol', 'br_if')) return
			parent.value[index] = parse(` (i32.const ${node.value})`)[0]
		}
	}
}
