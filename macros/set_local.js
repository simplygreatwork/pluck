
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'set_local',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (query.is_type_value(parent.value[0], 'symbol', 'set')) {
				parent.value[0].value = 'set_local'
			}
			if (! query.is_type_value(parent.value[0], 'symbol', 'set_local')) return
			parent.value[1].value = shared.dollarize(parent.value[1].value)
			if (query.is_expression_longer(parent, 2)) {
				if (query.is_type_value(parent.value[2], 'symbol', 'to')) {
					let index_ = query.remove(parent, parent.value[2])
					parent.emit('node.removed', index_)
				}
			}
			return declare(parent.value[1].value, state, system)
		}
	}
}

function declare(value, state, system) {
	
	if (shared.is_local(state, value)) return 
	let tree = parse (`
	(local ${value} i32)
	`)[0]
	query.insert(state.func, tree, state.locals.offset)
	state.func.emit('node.inserted', state.locals.offset)
	state.locals = shared.find_locals(state)
	return false
}
