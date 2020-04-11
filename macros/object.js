
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
				let components = components_(node, index, parents, state, document)
				if (! (components.subject && components.property)) return
				if (components.value) {
					object_set(node, index, parents, state, components, system)
				} else {
					if ((! components.arguments) || (components.arguments.length === 0)) {
						object_get(node, index, parents, state, components, system)
					} else {
						object_call(node, index, parents, state, components, system)
					}
				}
			})
		}
	}
}

function components_(node, index, parents, state, document) {
	
	let result = {}
	result.subject = get_subject(node, parents, state)
	if (result.subject) result.property = get_property(node, index, parents, state, document)
	if (result.property) result.value = get_value(node)
	if (result.subject && ! result.value) result.arguments = get_arguments(node)
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
			document.walk(node.value[1], 1, parents, state)
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
		return index > 1 && query.is_type(each, 'expression')				// fixme: review root cause in parser: unexpected whitespace node
	})
}

function object_set(node, index, parents, state, components, system) {
	
	let expression = parse(` (call $object_set )`)[0]
	expression.value[2] = components.subject
	expression.value[3] = components.property
	expose_property(expression, system)
	expression.value[4] = components.value
	query.climb(parents, function(node, index, parents) {
		let parent = query.last(parents)
		parent.value[index] = expression
	})
}

function object_get(node, index, parents, state, components, system) {
	
	let expression = parse(` (call $object_get)`)[0]
	expression.value[2] = components.subject
	expression.value[3] = components.property
	expose_property(expression, system)
	query.climb(parents, function(node, index, parents) {
		expression = catch_result(expression, query.last(parents), state)
	})
	query.climb(parents, function(node, index, parents) {
		let parent = query.last(parents)
		parent.value[index] = expression
	})
}

function object_call(node, index, parents, state, components, system) {
	
	let signature = components.arguments.map(function(argument_) {
		return '_i32'
	}).join('')
	let expression = parse(` (call $object_call${signature})`)[0]
	expression.value[2] = components.subject
	expression.value[3] = components.property
	expose_property(expression, system)
	expression.value.push(...components.arguments)
	query.climb(parents, function(node, index, parents) {
		expression = catch_result(expression, query.last(parents), state)
	})
	query.climb(parents, function(node, index, parents) {
		let parent = query.last(parents)
		parent.value[index] = expression
	})
}

function expose_property(expression, system) {
	
	if (system.objectify) {
		let expression_ = parse(` (call $object_subject)`)[0]
		expression_.value[2] = expression.value[3]
		expression.value[3] = expression_
	}
}

function catch_result(expression, parent, state) {
	
	if (parent.value[0].value == 'func') {
		let expression_ = parse(`(drop)`)[0]
		expression_.value[1] = expression
		expression = expression_
	}
	return expression
}
