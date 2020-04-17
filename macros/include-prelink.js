
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const utility = require('../compiler/utility')

let essentials = essentials_()
let objects = objects_()

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'include',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'include')) return
			if (query.is_type_value(parent.value[1], 'symbol', 'essentials')) include(essentials, node, index, parents, state)
			if (query.is_type_value(parent.value[1], 'symbol', 'essential-objects')) include(objects, node, index, parents, state)
		}
	}
}

function include(expression, node, index, parents, state) {
	
	query.climb(parents, function(node, index, parents) {
		let parent = query.last(parents)
		parent.value.splice(index + 1, 0, ...expression.value)
		parent.value.splice(index, 1)
		parent.emit('removed')
		parent.emit('rewind')
	})
}

function exists() {
	return false
}

function essentials_() {
	
	return parse(`(
	(import "../library/system.watm")
	(import "../library/memory.watm")
	(import "../library/resource.watm")
	(import "../library/utility.watm")
	(import "../library/string.watm")
	(import "../library/number.watm")
	(import "../library/boolean.watm")
	(import "../library/function.watm")
	(import "../library/list.watm")
	(import "../library/map.watm")
	(import "../library/object.watm")
	(import "../library/types.watm")
	(import "../library/console.watm")
	(import "../library/vector.watm")
	(import "../library/operator.watm")
	(import "host" "table" (table 1 anyfunc))
	(memory (import "host" "memory") 1)
	(global $system (import "host" "system") (mut i32))
	)`)[0]
}

function objects_() {
	
	return parse(`(
	(import "../library/objects/system.watm")
	(import "../library/objects/string.watm")
	(import "../library/objects/number.watm")
	(import "../library/objects/boolean.watm")
	(import "../library/objects/function.watm")
	(import "../library/objects/list.watm")
	(import "../library/objects/map.watm")
	)`)[0]
}
