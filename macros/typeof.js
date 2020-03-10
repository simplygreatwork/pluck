
const query = require('../compiler/query')
const parse = require('../compiler/parse')

let counter = 1;
let types = {}

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'typeof')) return
			if (types[node.value[1].value] === undefined) {
				types[node.value[1].value] = counter;
				if (false) print(node)
				counter++
			}
			node.value[0].value = 'i32.const'
			node.value[1].type = 'number'
			node.value[1].value = types[node.value[1].value]
		},

		exit: function(node, index, parents, state) {
			return
		}
	}
}

function print(node) {
	console.log('type ' + node.value[1].value + ' = ' + counter)
}
