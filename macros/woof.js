
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

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
			parent.on('exit', function() {
				console.log('comment parent exit')
				parent.splice(1, 0, index)
				parent.emit('node.removed', index)
				
			})
		}
	}
}
