
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		when: [{
			path: ['expression:', 'symbol:func', null, 'symbol:accepts'],	
		}, {
			path: ['expression:'],	
			contains: 'symbol:and'
		}, {
			operator: 'symbol:and'
		}, {
			path: ['symbol:plus']
		}, {
			path: ['number:']
		}, {
			path: ['string:']
		}],
		
		enter : function(node, index, parents, state) {	
			return
		},
		
		exit: function(node, index, parents, state) {
			return
		}
	}
}

function extract_operators() {
	
	let result = {}
	let index = 1
	system.macros = system.macros.filter(function(macro) {
		if (macro.operator) {
			macro.precedence = index++
			operators[macro.operator] = macro
			return false
		} else {
			return true
		}
	})
	system.operators = result
}

function collect_operators() {
	
	let collection = {}
	node.value.forEach(function(each, index) {
		if (each.type == 'symbol') {
			let name = each.value
			let macro = operators[name]
			let precedence = (macro && macro.operator) ? macro.precedence : -1
			if (precedence > -1) {
				collection[name] = collection[name] || [{macro: macro, indices: []}]
				collection[each.value].indices.unshift(index)
			}
		}
	})
	let operators = []
	Object.keys(collection).forEach(function(key) {
		operators.push(collection[key])
	})
	operators.sort(function(a, b) {
		a.macro.precedence < b.macro.precedence
	})
	return operators
}

function map_elements(node) {
	
	let result = {}
	node.value.forEach(function(each, index) {
		if (each.type == 'symbol') {
			result[each.value] = result[each.value] || []
			result[each.value].unshift(index)
		}
	})
	return result
}

function operator_collection(node) {
	
	let result = {}
	node.value.forEach(function(each, index) {
		if (each.type == 'symbol') {
			let name = each.value
			let precedence = operators[name] ? operators[name].precedence : -1
			if (precedence) {
				result[each.value] = result[each.value] || [{precedence: 0, indices: []}]
				result[each.value].indices.unshift(index)
			}
		}
	})
	return result
}

function index_of_macro(name) {
	return operators[name] ? operators[name].precedence : -1
}
