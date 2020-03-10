
const query = require('../compiler/query')
const parse = require('../compiler/parse')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'funcref')) return
	let id = system.table.find_function_id(node.value[1].value, node.value[2].value)
	node.value[0].type = 'symbol'
	node.value[0].value = 'i32.const'
	node.value[1].type = 'number'
	node.value[1].value = id
	node.value.pop()
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}