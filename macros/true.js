
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'true',
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type_value(node, 'symbol', 'true')) return
			let tree = parse(` (call $boolean_new (i32.const 1))`)[0]
			node.type = tree.type
			node.value = tree.value
		}
	}
}
