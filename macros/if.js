
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'if',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node, 'symbol', 'if')) return
			if (! (index === 0)) return
			if (is_resolved(parent)) return
			parent.once('exit', function() {
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					let expression = {
						type: 'expression',
						value: [
							{ type: 'symbol', value: 'if' },
							get_condition(node, index, parents, state, system),
							get_then(node, index, parents, state, system)
						]
					}
					query.replace(parent, node, expression)
				})
			})
		}
	}
}

function is_resolved(node) {
	
	if (query.is_type(node.value[1], 'expression')) {
		if (query.is_type(node.value[2], 'expression')) {
			if (query.is_type_value(node.value[2].value[0], 'symbol', 'then')) {
				return true
			}
		}
	}
	return false
}

function get_condition(node, index, parents, state, system) {
	
	let result
	if (query.is_type(node.value[1], 'expression')) {
		result = node.value[1]
	} else {
		result = {type: 'expression', value: node.value.filter(function(each) {
			if (! query.is_type_value(each, 'symbol', 'if')) return false
			if (query.is_type(each, 'expression')) return false
			return true
		})}
	}
	if (result.value[1] && result.value[1].value.indexOf('operator') > -1) {
		let expression = parse(` (call $boolean_value)`)[0]
		expression.value[2] = result
		if (system.objectify) {
			let expression_ = parse(` (call $object_subject)`)[0]
			expression_.value[2] = expression
			expression = expression_
		}
		result = expression
	}
	return result
}

function get_then(node, index, parents, state, system) {
	
	let expressions
	if (query.is_type(node.value[1], 'expression')) {
		if (query.is_type(node.value[2], 'expression')) {
			if (query.is_type_value(node.value[2].value[0], 'symbol', 'then')) {
				return node.value[2]			// "then" clause exists already, do not create
			}
		}
		expressions = node.value.filter(function(each, index) {
			if (query.is_type_value(each, 'symbol', 'if')) return false
			if (index <= 1) return false
			return true
		})
	} else {
		expressions = node.value.filter(function(each, index) {
			return (query.is_type(each, 'expression'))
		})
	}
	expressions.unshift({type: 'symbol', value: 'then'})
	return {type: 'expression', value: expressions}
}
