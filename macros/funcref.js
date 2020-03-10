
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'funcref')) return
			let id = system.table.find_function_id(node.value[1].value, node.value[2].value)
			node.value[0].type = 'symbol'
			node.value[0].value = 'i32.const'
			node.value[1].type = 'number'
			node.value[1].value = id
			node.value.pop()
		}
	}
}
