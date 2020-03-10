
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (! query.is_type_value(node, 'symbol', 'true')) return
	let tree = parse(` (i32.const 1)`)[0]
	node.type = tree.type
	node.value = tree.value
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}