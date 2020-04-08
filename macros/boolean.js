
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'boolean',
		
		enter: function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'boolean')) return
			parent.once('exit', function() {
				let value = parent.value[1].value == 'true' ? 1 : 0
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					parent.value[index] = parse(` (call $boolean_new (i32.const ${value}))`)[0]
				})
			})
		}
	}
}
