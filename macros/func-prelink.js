
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'func',
		
		enter : function(node, index, parents, state) {		
			
			let parent = query.last(parents)
			if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
			if (query.is_depth(parents, 2)) return
			if (query.is_length_exceeding(parent, 1)) {
				let func_name = parent.value[1].value
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					if (! parent) return 
					if (! parent.value[0]) return 
					if (query.is_type_value(parent.value[0], 'symbol', 'module')) return
					if (query.is_type_value(parent.value[0], 'symbol', 'import')) return
					if (query.is_type_value(parent.value[0], 'symbol', 'type')) return
					let length = parents[0].value.length
					query.append(parents[0], node)
					parents[0].emit('inserted', length)
					let expression = parse(` (function "${func_name}")`)[0]
					parent.value[index] = expression
				})
			}
		}
	}
}
