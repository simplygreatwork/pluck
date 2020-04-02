
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'false',
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type_value(node, 'symbol', 'false')) return
			let tree = parse(` (call $boolean_new (i32.const 0))`)[0]
			node.type = tree.type
			node.value = tree.value
		}
	}
}
