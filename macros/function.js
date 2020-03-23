
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const walk = require('../compiler/transform').walk
const shared = require('./shared.js')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'function',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node.value, 'symbol', 'function')) return
			// review: conversion to func would need to occur before the linking phase anyway
			if (query.is_type_value(parent.value[0], 'symbol', 'function')) parent.value[0].value = 'func'
			walk(node, index, parents, state)
		}
	}
}
