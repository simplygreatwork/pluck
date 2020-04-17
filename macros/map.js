
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'map:',
		
		enter: function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'map:')) return
			if (index != 0) return
			query.climb(parents, function(node, index, parents) {
				let parent = query.last(parents)
				let func_name = insert_map(node, index, parents, state, system, document)
				let expression = parse(` (call ${func_name})`)[0]
				parent.value[index] = expression
			})
		}
	}
}

function insert_map(node, index, parents, state, system, document) {
	
	let expression = node
	let id = system.state.id_static++
	let func_name = '$map_static_' + id
	let tree = parse(`
	(func ${func_name} (result i32)
		(local $map i32)
		(set_local $map (call $map_new))
		(get_local $map)
	)`)[0]
	let expressions_ = map_puts(expression)
	tree.value.splice(5, 0, ...expressions_)
	query.append(parents[0], tree)
	document.walk(tree, 0, parents, {})
	return func_name
}

function map_puts(expression) {
	
	let result = []
	expression.value.forEach(function(each, index) {
		if (index === 0) return
		let expression_ = parse(`\n\t\t(call $map_set (get_local $map))`)[0]
		let key = each.value[0]
		let value = each.value[1]
		key.type = 'string'
		expression_.value.push(key)
		expression_.value.push(value)
		result.push(expression_)
	})
	return result
}
