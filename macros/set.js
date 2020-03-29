
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'set',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'set')) return
			if (query.is_length_exceeding(parent, 2)) {
				if (query.is_type_value(parent.value[2], 'symbol', 'to')) {
					let index_ = query.remove(parent, parent.value[2])
					parent.emit('node.removed', index_)
				}
			}
			parent.value[0].value = 'set_local'
			parent.emit('node.rewind')
		}
	}
}
