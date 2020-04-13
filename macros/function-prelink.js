
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'function',
		
		enter : function(node, index, parents, state) {		
			
			let parent = query.last(parents)
			if (! query.is_type_value(parent.value[0], 'symbol', 'function')) return
			if (! query.is_type(parent.value[1], 'symbol')) return
			parent.value[0].value = 'func'
			if (false) parent.emit('rewind')
			if (false) document.walk(node, index, parents, state)
		}
	}
}
