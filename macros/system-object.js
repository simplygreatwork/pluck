
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const utility = require('../compiler/utility')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'symbol')) return
			if (utility.is_uppercase(node.value)) {
				let tree = parse(` ( (get_global $system) object "${node.value}")`)[0]
				query.replace(parent, node, tree)
				document.walk(parent.value[index], index, parents, state)
			}
		}
	}
}
