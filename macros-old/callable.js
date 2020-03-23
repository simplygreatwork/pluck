
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		

			if (! query.is_type(node, 'expression')) return
			if (! query.is_type(node.value[0], 'symbol')) return
			if (! shared.is_callable(document, node.value[0].value)) return
			node.value[0].whitespace = node.value[0].whitespace + ' '
			node.value.unshift({
				type: 'symbol',
				value: 'call'
			})
		}
	}
}
