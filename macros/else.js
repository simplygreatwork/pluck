
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'else',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node, 'symbol', 'else')) return
			if (! (index === 0)) return
			parent.once('exit', function() {
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					let previous = parent.value[index - 1]
					if (previous.value[0].value == 'if') {
						index = query.remove(parent, node)
						parent.emit('removed', index)
						previous.value.push(node)
					}
				})
			})
		}
	}
}
