
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {

			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'break')) return
			node.value[0].value = 'br'
			node.value.splice(1, 0, {
				type: 'symbol',
				value: '2',
				whitespace: ' '
			})
		}
	}
}
