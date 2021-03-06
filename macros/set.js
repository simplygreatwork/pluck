
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'set',
		
		enter : function(node, index, parents, state) {	
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! shared.is_inside_function(state)) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'set')) return
			if (system.keywords.indexOf(parent.value[1].value) > -1) {
				error(parent.value[1].value)
			}
			if (query.is_length_exceeding(parent, 2)) {
				if (query.is_type_value(parent.value[2], 'symbol', 'to')) {
					let index_ = query.remove(parent, parent.value[2])
					parent.emit('removed', index_)
				}
			}
			parent.value[0].value = 'set_local'
			parent.emit('rewind')
		}
	}
}

function warn(value) {
	
	console.error('')
	console.error(`>>>>> Warning: The variable "${value}" could conflict with an existing keyword. <<<<<`)
	console.error('')
}

function error(value) {
	
	console.error('')
	console.error(`>>>>> Error: The keyword "${value}" cannot be used as a variable name. <<<<<`)
	console.error('')
	process.exit(1)
}
