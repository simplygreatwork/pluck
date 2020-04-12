
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const iterate = require('../compiler/utility').iterate

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'accepts',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_length_exceeding(parent, 2)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
			if (! (index == 1 || index == 2)) return
			iterate(state.func.value, function(each, index_) {
				if (index_ <= index) return true
				if (query.is_type(each, 'expression')) return false
				if (query.is_type(each, 'whitespace')) return true			// whitespace should be folded already but encountered an issue anyway
				let value = shared.dollarize(each.value)
				parent.value[index_] = parse(` (param ${value} i32)`)[0]
				return true
			})
			parent.value.splice(index, 1)
			parent.emit('removed', index)
			state.locals = shared.find_locals(state)
		}
	}
}
