
const utility = require('./utility')

function walk(options) {
	
	if (options.visit) options.enter = options.visit
	let root = options.root
	let enter = options.enter || noop
	let exit = options.exit || noop
	walking(root, 0, [], enter, exit)
}

function walking(node, index, parents, enter, exit) {
	
	enter(node, index, parents)
	if (node.type == 'expression') {
		parents.push(node)
		utility.iterate(node.value, function(each, index) {
			walking(each, index, parents, enter, exit)
		}.bind(this))
		parents.pop()
	}
	exit(node, index, parents)
}

function noop() {
	return
}

module.exports = walk
