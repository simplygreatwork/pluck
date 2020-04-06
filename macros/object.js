
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
			parent.on('exit', function() {
				let components = components_(node, index, parents, state, document)
				if (! (components.subject && components.property)) return
				let expression
				if (components.value) {
					expression = parse(` (call $object_set )`)[0]
					expression.value[2] = components.subject
					expression.value[3] = components.property
					expression.value[4] = components.value
				} else {
					if ((! components.arguments) || (components.arguments.length === 0)) {
						expression = parse(` (call $object_get)`)[0]
						expression.value[2] = components.subject
						expression.value[3] = components.property
						query.climb(parents, function(node, index, parents) {
							expression = catch_result(expression, query.last(parents), state)
						})
					} else {
						let signature = components.arguments.map(function(argument_) {
							return 'i32_'
						}).join('')
						expression = parse(` (call $object_call_${signature}to_i32)`)[0]
						expression.value[2] = components.subject
						expression.value[3] = components.property
						expression.value.push(...components.arguments)
						query.climb(parents, function(node, index, parents) {
							expression = catch_result(expression, query.last(parents), state)
						})
					}
				}
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					parent.value[index] = expression
				})
			})
		}
	}
}

function components_(node, index, parents, state, document) {
	
	let result = {}
	result.subject = get_subject(node, parents, state)
	if (result.subject) result.property = get_property(node, index, parents, state, document)
	if (result.property) result.value = get_value(node)
	if (! result.value) result.arguments = get_arguments(node)
	return result
}

function get_subject(node, parents, state) {
	
	if (node.value.length > 0) {
		let subject = node.value[0]
		if (query.is_type(subject, 'expression')) return subject
	}
}

function get_property(node, index, parents, state, document) {
	
	if (node.value.length > 1) {
		if (query.is_type(node.value[1], 'symbol')) {
			node.value[1].type = 'string'
			document.walk(node.value[1], 0, parents, state)
		}
		return node.value[1]
	}
}

function get_value(node) {
	
	if (node.value.length > 3) {
		if (node.value[2].value == 'is') return node.value[3]
		if (node.value[2].value == '=') return node.value[3]
	}
}

function get_arguments(node) {
	
	return node.value.filter(function(each, index) {
		return index > 1
	})
}

function catch_result(expression, parent, state) {
	
	if (parent.value[0].value == 'func') {
		let dispose = '$___dispose___'
		let expression_ = parse(` (set_local ${dispose})`)[0]
		expression_.value[2] = expression
		expression = expression_
		shared.declare(shared.dollarize(dispose), state)
	}
	return expression
}
