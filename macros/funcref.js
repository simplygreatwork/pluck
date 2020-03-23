
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'funcref',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'funcref')) return
			if (! (index === 0)) return
			parent.once('exit', function() {
				let func = shared.dollarize(parent.value[1].value)
				let module = parent.value[2].value
				let id = system.table.find_function_id(func, module)
				parent.value[0].type = 'symbol'
				parent.value[0].value = 'i32.const'
				parent.value[1].type = 'number'
				parent.value[1].value = id
				parent.value.pop()
			})
		}
	}
}
