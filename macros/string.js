
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'string',
		
		enter: function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'string')) return
			parent.once('exit', function() {
				let string = parent.value[1].value
				let func_name = shared_string.function_new(parents[0], string, system)
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					let tree = parse(` (call ${func_name})`)[0]
					parent.value[index] = tree
				})
			})
		}
	}
}
