
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type(node.value[0], 'symbol')) return
	if (! shared.is_callable(document, node.value[0].value)) return
	node.value[0].whitespace = node.value[0].whitespace + ' '
	node.value.unshift({
		type: 'symbol',
		value: 'call'
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
