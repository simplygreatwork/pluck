
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'func',
		
		enter : function(node, index, parents, state) {		
			return
		}
	}
}
