
const query = require('../compiler/query')
const parse = require('../compiler/parse')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'typeof',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'typeof')) return
			if (! (index === 0)) return
			let type = parent.value[1].value
			if (system.state.index_type[type] === undefined) {
				system.state.index_type[type] = system.state.id_type
				system.state.id_type++
			}
			parent.value[0].value = 'i32.const'
			parent.value[1].type = 'number'
			parent.value[1].value = system.state.index_type[type]
		}
	}
}
