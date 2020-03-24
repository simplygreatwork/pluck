
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared.js')
const iterate = require('../compiler/utility').iterate

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'accepts',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_expression_longer(parent, 2)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
			if (! query.is_type_value(parent.value[2], 'symbol', 'accepts')) return
			iterate(state.func.value, function(each, index) {
				if (index <= 2) return true
				if (query.is_type(each, 'expression')) return false
				if (query.is_type(each, 'whitespace')) return true			// whitespace should be folded already but encountered an issue anyway
				let value = shared.dollarize(each.value)
				parent.value[index] = parse(` (param ${value} i32)`)[0]
				return true
			})
			parent.value.splice(2, 1)
			parent.emit('node.removed', 2)
			state.locals = shared.find_locals(state)
		}
	}
}
