
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

function infix(instruction, precedence, node, index, parents, state) {
	
	let parent = query.last(parents)
	instruction = shared.dollarize(instruction)
	initialize(node, index, parent, state)
	parent.operations.push({
		index: index,
		instruction: instruction,
		precedence: precedence,
		perform: function(index) {
			parent.value.splice(index, 1)
			parent.value.splice(index - 1, 0, {type: 'symbol', value: instruction, whitespace: ' '})
			parent.value.splice(index - 1, 0, {type: 'symbol', value: 'call'})
			if (query.is_expression_longer(parent, 4)) {
				let expression = {type: 'expression', value: [], whitespace: ' '}
				expression.value.push(...parent.value.splice(index - 1, 4))
				parent.value.splice(index - 1, 0, expression)
				parent.emit('node.removed', index)
				parent.emit('node.removed', index)
				parent.emit('node.removed', index)
			}
		}
	})
}

function prefix(instruction, precedence, node, index, parents, state) {
	
	let parent = query.last(parents)
	instruction = shared.dollarize(instruction)
	initialize(node, index, parent, state)
	parent.operations.push({
		index: index,
		instruction: instruction,
		precedence: precedence,
		perform: function(index) {
			let expression = parse (`
				(call ${instruction} (i32.const 1))
			`)[0]
			expression.value.splice(2, 0, parent.value[index + 1])
			parent.value[index] = expression
			parent.value.splice(index + 1, 1)
			parent.emit('node.removed', index + 1)
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
