
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared.js')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	// review: conversion to func would need to occur before the linking phase anyway
	if (query.is_type_value(node.value[0], 'symbol', 'function')) node.value[0].value = 'func'
	if (! query.is_type_value(node.value[0], 'symbol', 'func')) return
	if (! query.is_expression_longer(node, 1)) return
	if (! node.value[1].value) return
	if (! (node.value[1].type == 'symbol')) return
	state.func = node
	state.locals = shared.find_locals(state)
	node.value[1].value = shared.dollarify(node.value[1].value)
}

function exit(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'func')) return
	if (! query.is_expression_longer(node, 1)) return
	if (! node.value[1].value) return
	if (! (node.value[1].type == 'symbol')) return
	state.func = null
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter,
		exit
	}
}
