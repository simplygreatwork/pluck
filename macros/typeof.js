
const query = require('../compiler/query')
const parse = require('../compiler/parse')

let system = null
let document = null
let counter = 1;
let types = {}

function enter(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'typeof')) return
	if (types[node.value[1].value] === undefined) {
		types[node.value[1].value] = counter;
		if (false) print(node)
		counter++
	}
	node.value[0].value = 'i32.const'
	node.value[1].type = 'number'
	node.value[1].value = types[node.value[1].value]
}

function print(node) {
	console.log('type ' + node.value[1].value + ' = ' + counter)
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
