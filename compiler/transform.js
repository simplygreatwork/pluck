
const logger = require('./logger')()
const emitter = require('./emitter')
const query = require('./query')

class Transform {
	
	constructor(system, document) {
		
		this.system = system
		this.document = document
	}
	
	transform(macros_) {
		
		this.macros = {}
		this.system.keywords = {}
		macros_.forEach(function(macro, precedence) {
			macro = macro(this.system, this.document, precedence)
			let key = macro.type + ':' + (macro.value ? macro.value : '')
			if (macro.value) this.system.keywords[macro.value] = macro.value
			this.macros[key] = this.macros[key] || []
			this.macros[key].push(macro)
		}.bind(this))
		this.system.keywords = Array.from(Object.keys(this.system.keywords))
		let tree = this.document.tree
		this.walk(tree[0], 0, [], {})
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
		this.process(node, index, parents, state, this.macros[node.type + ':'])
		this.iterate(node, function(each, index_) {
			this.walk(each, index_, parents, state)
		}.bind(this))
		node.emit('exit')
		if (false) strike(node, parents)										// issue: failing now that using pre and post macros
		parents.pop(node)
	}
	
	iterate(node, function_) {
		
		node.index = 0
		node.length = node.value.length
		let inserted = node.on('inserted', function(index) {
			node.length = node.value.length
			if (index <= node.index) {
				node.index++
			}
		})
		let removed = node.on('removed', function(index) {
			node.length = node.value.length
			if (index <= node.index) {
				node.index--
			}
		})
		let rewind = node.on('rewind', function() {
			node.index = -1
		})
		for (node.index = 0; node.index < node.length; node.index++) {
			function_(node.value[node.index], node.index)
		}
		inserted()
		removed()
		rewind()
	}
	
	atoms(node, index, parents, state) {
		
		this.install(node)
		this.process(node, index, parents, state, this.macros[node.type + ':'])
		this.process(node, index, parents, state, this.macros[node.type + ':' + node.value])
	}
	
	process(node, index, parents, state, macros) {
		
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
	
	strike(node, parents) {
		
		let parent = query.last(parents, 1)
		if (node.on) node.on('exit', function() {
			if (parent && parent.once) parent.once('exit', function() {
				this.uninstall(node)													// revisit the reasoning for this nested logic
			}.bind(this))
		}.bind(this))
	}
}

module.exports = Transform