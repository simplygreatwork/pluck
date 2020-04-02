
const print = require('./print')
const logger = require('./logger')()
const emitter = require('./emitter')
const query = require('./query')

class Transform {
	
	constructor(system, document) {
		
		this.system = system
		this.document = document
	}
	
	transform() {
		
		this.macros = {}
		this.system.macros.forEach(function(macro, precedence) {
			macro = macro(this.system, this.document, precedence)
			let key = macro.type + ':' + (macro.value ? macro.value : '')
			this.macros[key] = this.macros[key] || []
			this.macros[key].push(macro)
		}.bind(this))
		let tree = this.document.tree
		this.walk(tree[0], 0, [], {})
		let code = print(tree)
		logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
		logger('transform').log('tree transformed: ' + code)
		return code
	}
	
	walk(node, index, parents, state) {
		
		if (node.type == 'expression') {
			this.expressions(node, index, parents, state)
		} else {
			this.atoms(node, index, parents, state)
		}
	}
	
	expressions(node, index, parents, state) {
		
		parents.push(node)
		this.install(node)
		node.emit('enter')
		this.iterate(node, function(each, index_) {
			this.walk(each, index_, parents, state)
		}.bind(this))
		node.emit('exit')
		let parent = query.last(parents, 1)
		node.on('exit', function() {
			parent.once('exit', function() {
				this.uninstall(node)													// revisit the reasoning for this logic
			}.bind(this))
		}.bind(this))
		parents.pop(node)
	}
	
	iterate(node, function_) {
		
		node.index = 0
		node.length = node.value.length
		let inserted = node.on('node.inserted', function(index) {
			node.length = node.value.length
			if (index <= node.index) {
				node.index++
			}
		})
		let removed = node.on('node.removed', function(index) {
			node.length = node.value.length
			if (index <= node.index) {
				node.index--
			}
		})
		let rewind = node.on('node.rewind', function() {
			node.index = -1
		})
		for (node.index = 0; node.index < node.length; node.index++) {
			let result = function_(node.value[node.index], node.index)
			if (result === false) break
		}
		inserted()
		removed()
		rewind()
	}
	
	atoms(node, index, parents, state) {
		
		this.install(node)
		this.atom(node, index, parents, state, this.macros[node.type + ':'])
		this.atom(node, index, parents, state, this.macros[node.type + ':' + node.value])
	}
	
	atom(node, index, parents, state, macros) {
		
		if (! macros) return
		macros.forEach(function(macro) {
			if (macro.enter) {
				node.emit('enter')
				macro.enter(node, index, parents, state)
			}
			if (macro.exit) {
				node.emit('exit')
				macro.exit(node, index, parents, state)
			}
		})
	}
	
	install(node) {
		
		node.on = emitter.on
		node.once = emitter.once
		node.emit = emitter.emit
	}
	
	uninstall(node) {
		
		delete node.on
		delete node.once
		delete node.emit
	}
}

module.exports = Transform