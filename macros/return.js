
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// todo: a robust return keyword will swallow execution of subsequent lines using if/else transforms
// todo: also, insert (result i32) automatically in function header

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'return',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'return')) return
			if (! query.is_length_exceeding(node, 1)) return
			if (! (index === 0)) return
			parent.once('exit', function() {
				let expression = parent.value[1]
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					parent.value[index] = expression
				})
			})
		}
	}
}
