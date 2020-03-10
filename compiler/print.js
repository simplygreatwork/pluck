
const walk = require('./walk.js')

function print(tree) {
	
	let result = []
	walk({
		root: tree[0],
		visit: function(node, index, parents) {
			if (node.whitespace) result.push(node.whitespace)
			if (node.type == 'expression') {
				return
			} else if (node.type == 'string') {
				result.push('"')
				result.push(node.value)
				result.push('"')
			} else {
				result.push(node.value)
			}
		},
		enter: function(node) {
			result.push('(')
		},
		exit: function(node) {
			result.push(')')
		}
	})
	return result.join('')
}

module.exports = print
