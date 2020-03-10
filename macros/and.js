
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		

			if (! query.is_type(node, 'expression')) return
			if (! query.is_expression_longer(node, 2)) return
			if (! shared.is_inside_function(state)) return
			query.elements('and', node, state, function(index) {
				node.value.splice(index - 1, 0, node.value.splice(index, 1))
				node.value[index - 1].type = 'symbol'
				node.value[index - 1].value = 'i32.and'
				if (query.is_expression_longer(node, 3)) {
					let expression = {type: 'expression', value: [], whitespace: ' '}
					expression.value.push(...node.value.splice(index - 1, 3))
					node.value.splice(index - 1, 0, expression)
				}
			})
		}
	}
}
