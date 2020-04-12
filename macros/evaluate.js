
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'expression',
		
		enter : function(node, index, parents, state) {
			
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(node, 'expression')) return
			let parent = query.last(parents)
			parent.once('exit', function() {
				if (! query.is_type(node.value[0], 'expression')) return
				query.climb(parents, function(node, index, parents_) {
					let parent = query.last(parents_)
					let signature = node.value.map(function(value, index) {
						return '_i32'
					}).join('')
					let expression = parse(` (call $system_evaluate${signature})`)[0]
					symbols_stringify(node, index, parents, state, document)
					node.value.forEach(function(each) {
						expression.value.push(each)
					})
					expression = drop_result(expression, parent, state)
					parent.value[index] = expression
				})
			})
		}
	}
}

function symbols_stringify(node, index, parents, state, document) {
	
	node.value.forEach(function(value, index) {
		if (query.is_type(value, 'symbol')) {
			value.type = 'string'
			let parent = query.last(parents)
			document.walk(value, index, parents, state)
		}
	})
}

function drop_result(expression, parent, state) {
	
	if (parent.value[0].value == 'func') {
		let expression_ = parse(`(drop)`)[0]
		expression_.value[1] = expression
		expression = expression_
	}
	return expression
}
