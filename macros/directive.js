
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'directive',
		
		enter: function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'directive')) return
			if (query.is_type_value(parent.value[1], 'symbol', 'literals')) {
				if (query.is_length_exceeding(parent, 3)) {
					if (query.is_type_value(parent.value[3], 'symbol', 'objects')) {
						system.objectify = true
					} else if (query.is_type_value(parent.value[3], 'symbol', 'primitives')) {
						system.objectify = false
					}
				} else {
					system.objectify = true
				}
			}
			query.climb(parents, function(node, index, parents) {
				let parent = query.last(parents)
				parent.value.splice(index, 1)
				parent.emit('removed', index)
			})
		}
	}
}
