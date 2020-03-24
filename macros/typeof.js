
const query = require('../compiler/query')
const parse = require('../compiler/parse')

let counter = 1;
let types = {}

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'typeof',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'typeof')) return
			if (! (index === 0)) return
			parent.once('exit', function() {
				if (types[parent.value[1].value] === undefined) {
					types[parent.value[1].value] = counter;
					if (false) print(parent)
					counter++
				}
				parent.value[0].value = 'i32.const'
				parent.value[1].type = 'number'
				parent.value[1].value = types[parent.value[1].value]
			})
		}
	}
}

function print(parent) {
	console.log('type ' + parent.value[1].value + ' = ' + counter)
}
