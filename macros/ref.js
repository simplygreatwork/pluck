
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'ref',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'ref')) return
			if (! (index === 0)) return
			let parts = parts_(parent.value[1].value, document)
			let id = system.table.find_function_id(parts.func, parts.module)
			if (id) {
				parent.value[0].type = 'symbol'
				parent.value[0].value = 'i32.const'
				parent.value[1].type = 'number'
				parent.value[1].value = id
			} else {
				console.error('')
				console.error(`>>>>> Unable to find function "${result.func}" or module "${result.module}" <<<<<`)
				console.error('')
				process.exit(1)
			}
		}
	}
}

function parts_(path_, document) {
	
	let result = {}
	let array = path_.split('/')
	if (array.length == 1) {
		result.module = document.id
		result.func = shared.dollarize(array[0])
	} else {
		result.func = shared.dollarize(array.pop())
		result.module = array.join('/')
	}
	return result
}
