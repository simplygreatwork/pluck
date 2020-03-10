
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_expression_longer(node, 2)) return
			if (! query.is_type_value(node.value[0], 'symbol', 'func')) return
			if (! query.is_type_value(node.value[2], 'symbol', 'accepts')) return
			node.value.every(function(each, index) {
				if (index <= 2) return true
				if (query.is_type(each, 'expression')) return false
				if (query.is_type(each, 'whitespace')) return true			// whitespace ought to be folded already but encountered an issue anyway
				let value = shared.dollarify(each.value)
				node.value[index] = parse(` (param ${value} i32)`)[0]
				return true
			})
			node.value.splice(2, 1)
		},

		exit: function(node, index, parents, state) {
			return
		}
	}
}