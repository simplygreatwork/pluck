
const query = require('./query')
const Bus = require('./bus')

// Walker.js is a refactor of walk.js for initial use with macros to provide for enter/exit
// process.js will need to be refactored to work with this class

module.exports = class Walker {
	
	constructor(options) {
		
		options = options || {}
		Object.assign(options, this)
		this.bus = new Bus()
	}
	
	on(key, func) {
		this.bus.on(key, func)
	}
	
	walk(node) {
		this.node(node, 0, [], {}, iterate_backward)
	}
	
	node(node, index, parents, state, iterate) {
		
		if (query.is_type(node, 'expression')) {
			if (this.bus.emit('enter.expression', node, index, parents, state) === false) return false
			parents.push(node)
			iterate(node.value, function(each, index) {
				if (this.node(each, index, parents, state, iterate) === false) return false
			}.bind(this))
			parents.pop()
			if (this.bus.emit('exit.expression', node, index, parents, state) === false) return false
		} else {
			if (this.bus.emit('enter.atom', node, index, parents, state) === false) return false
			if (this.bus.emit('exit.atom', node, index, parents, state) === false) return false
		}
	}
}

function iterate_forward(array, handler) {
	
	let length = array.length
	for (let index = 0; index < length; index++) {
		if (handler(array[index], index) === false) {
			iterate_forward(array, handler)
			break
		}
	}
}

function iterate_backward(array, handler) {
	
	let length = array.length
	for (let index = length - 1; index >= 0; index--) {
		if (handler(array[index], index) === false) {
			iterate_backward(array, handler)
			break
		}
	}
}
