
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'break',
		
		enter : function(node, index, parents, state) {		
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'break')) return
			if (! (index === 0)) return
			parent.value[0].value = 'br'
			parent.value.splice(1, 0, {
				type: 'symbol',
				value: '2',
				whitespace: ' '
			})
			parent.emit('node.inserted', 1)
		}
	}
}
