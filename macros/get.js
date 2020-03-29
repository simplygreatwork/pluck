
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		
		enter : function(node, index, parents, state) {	
			
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'symbol')) return
			let value = shared.dollarize(node.value)
			if (! shared.is_local(state, value)) return
			if (! index > 0) return
			let parent = query.last(parents)
			let previous = parent.value[index - 1]
			let replace = true
			replace = (query.is_type_value(previous, 'symbol', 'param')) ? false : replace
			replace = (query.is_type_value(previous, 'symbol', 'result')) ? false : replace
			replace = (query.is_type_value(previous, 'symbol', 'local')) ? false : replace
			replace = (query.is_type_value(previous, 'symbol', 'get_local')) ? false : replace
			replace = (query.is_type_value(previous, 'symbol', 'set_local')) ? false : replace
			replace = (query.is_type_value(previous, 'symbol', 'call')) ? false : replace
			if (replace) {
				let tree = parse(` (get_local ${value})`)[0]
				query.replace(parent, node, tree)
			} else {
				node.value = value
			}
		}
	}
}
