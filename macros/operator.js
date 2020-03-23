
const query = require('../compiler/query')

function infix(instruction, precedence, node, index, parents, state) {
	
	let parent = query.last(parents)
	initialize(node, index, parent, state)
	parent.operations.push({
		index: index,
		instruction: instruction,
		precedence: precedence,
		perform: function(index) {
			parent.value.splice(index - 1, 0, parent.value.splice(index, 1))
			parent.value[index - 1].type = 'symbol'
			parent.value[index - 1].value = instruction
			if (query.is_expression_longer(parent, 3)) {
				let expression = {type: 'expression', value: [], whitespace: ' '}
				expression.value.push(...parent.value.splice(index - 1, 3))
				parent.value.splice(index - 1, 0, expression)
			}
		}
	})
}

function prefix(instruction, precedence, node, index, parents, state) {
	
	let parent = query.last(parents)
	initialize(node, index, parent, state)
	parent.operations.push({
		index: index,
		instruction: instruction,
		precedence: precedence,
		perform: function(index) {
			return
		}
	})
}

function initialize(node, index, parent, state) {
	
	if (parent.operations === undefined) {
		parent.operations = []
		parent.once('exit', function() {
			let operations = parent.operations
			operations.sort((a, b) => a.precedence - b.precedence)
			operations.forEach(function(operation, index) {
				let length = parent.value.length
				operation.perform(operation.index)
				let change = length - parent.value.length
				for (let i = index; i < operations.length; i++) {
					if (operations[i].index > operation.index) operations[i].index = operations[i].index - change
				}
			})
		})
	}
}

module.exports = {
	infix,
	prefix
}