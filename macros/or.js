
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_expression_longer(node, 2)) return
	if (! shared.is_inside_function(state)) return
	query.elements('or', node, state, function(index) {
		node.value.splice(index - 1, 0, node.value.splice(index, 1))
		node.value[index - 1].type = 'symbol'
		node.value[index - 1].value = 'i32.or'
		if (query.is_expression_longer(node, 3)) {
			let expression = {type: 'expression', value: [], whitespace: ' '}
			expression.value.push(...node.value.splice(index - 1, 3))
			node.value.splice(index - 1, 0, expression)
		}
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
