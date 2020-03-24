
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(node, 'symbol')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_callable(document, node.value)) return
			if (index === 0) {
				node.whitespace = node.whitespace + ' '
				parent.value.splice(index, 0, {
					type: 'symbol',
					value: 'call'
				})
				if (false) parent.emit('node.inserted', index)
			}
		}
	}
}
