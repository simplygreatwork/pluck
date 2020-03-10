
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	state.elements = query.map_elements(node)
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
