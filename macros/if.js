
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node.value[0], 'symbol', 'if')) return
		},
		
		exit: function(node, index, parents, state) {
			
			if (! query.is_type(node, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(node.value[0], 'symbol', 'if')) return
			if (is_ready(node)) return
			
			let condition = get_condition(node, index, parents)
			let then = get_then(node, index, parents)
			let tree = {type: 'expression', value: [{ type: 'symbol', value: 'if'}]}
			tree.value.push(condition)
			tree.value.push(then)
			query.replace(query.last(parents), node, tree)
		}
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

function is_ready(node) {
	
	if (query.is_type(node.value[1], 'expression')) {
		if (query.is_type(node.value[2], 'expression')) {
			if (query.is_type_value(node.value[2].value[0], 'symbol', 'then')) {
				return true
			}
		}
	}
	return false
}
