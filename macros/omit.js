
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// a simple macro for testing parent.on('exit')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'omit',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node, 'symbol', 'omit')) return
			if (! (index === 0)) return
			parent.once('exit', function() {
				console.log('omit parent exit')
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					parent.value.splice(index, 1)
					parent.emit('removed', index)
					console.log('omit removed')
				})
			})
		}
	}
}
