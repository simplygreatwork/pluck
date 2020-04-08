
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

const skips = ['param', 'result', 'local', 'get_local', 'set_local', 'get_global', 'set_global', 'call']

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'symbol')) return
			if (! shared.is_local(state, shared.dollarize(node.value))) return
			let replace = true
			if (index > 0) {
				let previous = parent.value[index - 1]
				if (query.is_type(previous, 'symbol') && skips.indexOf(previous.value) > -1) replace = false 
			}
			else if (node.value == 'type' && parents.length > 1 && parents[parents.length - 2].value[0].value == "call_indirect") replace = false
			else if (node.value == 'result' && parent.value.length > 1 && parent.value[1].value == 'i32') replace = false
			else if (node.value == 'string' && parent.value.length > 1 && parent.value[1].type == 'string') replace = false
			if (replace) {
				let value = shared.dollarize(node.value)
				let tree = parse(` (get_local ${value})`)[0]
				query.replace(parent, node, tree)
			}
		}
	}
}
