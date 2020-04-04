
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
			let parent = query.last(parents)
			let replace = true
			if (index > 0) {
				let previous = parent.value[index - 1]
				replace = (query.is_type_value(previous, 'symbol', 'param')) ? false : replace
				replace = (query.is_type_value(previous, 'symbol', 'result')) ? false : replace
				replace = (query.is_type_value(previous, 'symbol', 'local')) ? false : replace
				replace = (query.is_type_value(previous, 'symbol', 'get_local')) ? false : replace
				replace = (query.is_type_value(previous, 'symbol', 'set_local')) ? false : replace
				replace = (query.is_type_value(previous, 'symbol', 'call')) ? false : replace
			} else {
				if (node.value == 'type' && parents[parents.length - 2].value[0].value == "call_indirect") {
					replace = false
					value = node.value
				}
				if (node.value == 'result' && parent.value.length > 1 && parent.value[1].value == 'i32') {
					replace = false
					value = node.value
				} 
			}
			if (replace) {
				let tree = parse(` (get_local ${value})`)[0]
				query.replace(parent, node, tree)
			} else {
				node.value = value
			}
		}
	}
}
