
const query = require('../compiler/query')
const parse = require('../compiler/parse')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_expression_length(node, 2)) return
	if (! query.is_type_value(node.value[0], 'symbol', 'import')) return
	if (node.value[1].type == 'string') {
		query.remove(parents[0], node)
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
