
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {
			
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'symbol')) return
			let value = shared.dollarize(node.value)
			if (! shared.is_local(state, value)) return
			if (! index > 0) return
			let parent = query.last(parents)
			let previous = parent.value[index - 1]
			let substitute = true
			substitute = (query.is_type_value(previous, 'symbol', 'param')) ? false : substitute
			substitute = (query.is_type_value(previous, 'symbol', 'result')) ? false : substitute
			substitute = (query.is_type_value(previous, 'symbol', 'local')) ? false : substitute
			substitute = (query.is_type_value(previous, 'symbol', 'get_local')) ? false : substitute
			substitute = (query.is_type_value(previous, 'symbol', 'set_local')) ? false : substitute
			substitute = (query.is_type_value(previous, 'symbol', 'call')) ? false : substitute
			if (substitute) {
				let tree = parse(` (get_local ${value})`)[0]
				query.replace(parent, node, tree)
			} else {
				node.value = value
			}
		}
	}
}
