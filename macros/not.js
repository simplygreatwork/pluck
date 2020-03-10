
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_expression_longer(node, 2)) return
	if (! shared.is_inside_function(state)) return
	query.elements('not', node, state, function(index) {
		let tree = parse(`(i32.eq () (i32.const 0))`)[0]
		tree.value[1] = node.value[index + 1]
		node.value[index + 1] = tree
		node.value.splice(index, 1)
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
