
const walk = require('./walk')

function print_preserved(tree) {
	
	let result = []
	walk({
		root: tree[0],
		enter: function(node, index, parents) {
			if (node.whitespace) result.push(node.whitespace)
			if (node.type == 'expression') {
				result.push('(')
			} else if (node.type == 'string') {
				result.push('"')
				result.push(node.value)
				result.push('"')
			} else {
				result.push(node.value)
			}
		},
		exit: function(node, index, parent) {
			if (node.type == 'expression') {
				result.push(')')
			}
		}
	})
	return result.join('')
}

// if any expression ancestor will fit under 80 chars (with indent) then print on a single line

function print_tidy(tree) {
	
	let result = []
	walk({
		root: tree[0],
		enter: function(node, index, parents) {
			if (node.type == 'expression') {
				result.push('\n')
				result.push(padding(parents))
				result.push('(')
			} else if (node.type == 'string') {
				if (index > 0) result.push(' ')
				result.push('"')
				result.push(node.value)
				result.push('"')
			} else {
				if (index > 0) result.push(' ')
				result.push(node.value)
			}
		},
		exit: function(node, index, parents) {
			if (node.type == 'expression') {
				let contains = false
				node.value.forEach(function(node_) {
					if (node_.type == 'expression') contains = true
				})
				if (contains) {
					result.push('\n')
					result.push(padding(parents))
				}
				result.push(')')
			}
		}
	})
	return result.join('')
}

function padding(parents) {
	
	let result = []
	parents.forEach(function(value) {
		result.push('\t')
	})
	return result.join('')
}

module.exports = print_preserved
