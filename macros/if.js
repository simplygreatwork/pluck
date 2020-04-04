
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
				if (false) console.log('if parent exit')
				query.climb(parents, function(node, index, parents) {
					let parent = query.last(parents)
					let expression = {
						type: 'expression',
						value: [
							{ type: 'symbol', value: 'if' },
							transform(get_condition(node, index, parents)),
							get_then(node, index, parents)
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

function transform(condition) {
	
	if (condition.value[1] && condition.value[1].value.indexOf('operator') > -1) {
		let expression = parse(` (call $boolean_value)`)[0]
		expression.value[2] = condition
		return expression
	} else {
		return condition
	}
}

function get_condition(node, index, parents) {
	
	if (query.is_type(node.value[1], 'expression')) {
		return node.value[1]
	} else {
		return {type: 'expression', value: node.value.filter(function(each) {
			if (! query.is_type_value(each, 'symbol', 'if')) return false
			if (query.is_type(each, 'expression')) return false
			return true
		})}
	}
}

function get_condition2(node, index, parents) {
	
	if (query.is_type(node.value[1], 'expression')) {
		return node.value[1]
	} else {
		return {type: 'expression', value: node.value.filter(function(each) {
			if (! query.is_type_value(each, 'symbol', 'if')) return false
			if (query.is_type(each, 'expression')) return false
			return true
		})}
	}
}

function get_then(node, index, parents) {
	
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
