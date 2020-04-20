
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

const debug = false

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
	
	let id = system.state.id_static++
	let func_name = '$map_static_' + id
	if (debug) console.log('func_name: ' + func_name)
	let tree = parse(`
	(func ${func_name} (result i32)
		(local $map i32)
		(set_local $map (call $object_map_new))
		(get_local $map)
	)`)[0]
	let items = map_put(node)
	tree.value.splice(5, 0, ...items)
	query.append(parents[0], tree)
	document.walk(tree, 0, parents, {func: state.func})
	return func_name
}

function map_put(expression) {
	
	let result = []
	for (let index = 1, length = expression.value.length; index < length; index++) {
		let each = expression.value[index]
		if (query.is_type(each, 'expression')) {
			map_put_each(result, each.value[0], each.value[1])
		} else {
			let next = expression.value[index + 1]
			map_put_each(result, each, next)
			index++
		}
	}
	return result
}

function map_put_each(expression, key, value) {
	
	if (! query.is_type_value(key, 'symbol', 'call')) {
		let expression_ = parse(`\n\t\t(call $object_map_set_ (get_local $map))`)[0]
		expression_.value.push(key)
		expression_.value.push(value)
		expression.push(expression_)
	} else {										// todo: find root cause of this else condition
		if (debug) console.log('bogus key:' + JSON.stringify(key, ['type', 'value']))
		if (debug) console.log('bogus value:' + JSON.stringify(value, ['type', 'value']))
	}
}
