
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))

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
					let condition = get_condition(node, index, parents)
					let then = get_then(node, index, parents)
					let if_ = { type: 'expression', value: [{ type: 'symbol', value: 'if'}] }
					if_.value.push(condition)
					if_.value.push(then)
					query.replace(parent, node, if_)
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
