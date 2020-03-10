
function walk(options) {
	
	let root = options.root
	let reverse = (options.reverse === undefined) ? false : options.reverse 
	let iterate = (reverse == true) ? iterate_backward : iterate_forward 
	let visit = options.visit || noop
	let enter = options.enter || noop
	let exit = options.exit || noop
	walking(root, 0, [], iterate, visit, enter, exit)
}

function walking(node, index, parents, iterate, visit, enter, exit) {
	
	if (node.type == 'expression') {
		parents.push(node)
		enter(node)
		iterate(node.value, function(each, index) {
			let result = visit(each, index, parents)
			if (result == 'invalidate') return result
			walking(each, index, parents, iterate, visit, enter, exit)
		})
		exit(node)
		parents.pop()
	}
}

function iterate_forward(array, handler) {
	
	let length = array.length
	for (let index = 0; index < length; index++) {
		if (handler(array[index], index) == 'invalidate') {
			iterate_forward(array, handler)
			break
		}
	}
}

function iterate_backward(array, handler) {
	
	let length = array.length
	for (let index = length - 1; index >= 0; index--) {
		if (handler(array[index], index) == 'invalidate') {
			iterate_backward(array, handler)
			break
		}
	}
}

function noop() {
	return
}

module.exports = walk
