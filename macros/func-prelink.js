
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'func',
		
		enter : function(node, index, parents, state) {		
			
			let parent = query.last(parents)
			if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
			if (query.is_depth(parents, 2)) return
			if (! query.is_length_exceeding(parent, 1)) return
			state.func = parent
			parent.once('exit', function() {
				query.climb(parents, function(node_, index_, parents_) {
					let parent_ = query.last(parents_)
					if (query.is_type_value(parent_.value[0], 'symbol', 'module')) return
					if (query.is_type_value(parent_.value[0], 'symbol', 'import')) return
					if (query.is_type_value(parent_.value[0], 'symbol', 'type')) return
					let func_name = func_name_(parent, system)
					let length = parents_[0].value.length
					query.append(parents_[0], node_)
					parents_[0].emit('inserted', length)
					let expression = parse(` (function "${func_name}")`)[0]
					parent_.value[index_] = expression
				})
			})
		}
	}
}

function func_name_(parent, system) {
	
	if (query.is_type(parent.value[1], 'symbol')) {
		return parent.value[1].value
	} else {
		let symbol = '$function_static_' + (++system.state.id_function)
		let expression = parse(`( ${symbol})`)[0].value[0]
		parent.value.splice(1, 0, expression)
		parent.emit('inserted', 1)
		return symbol
	}
}
