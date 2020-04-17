
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const shared_string = require('./string-shared')

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'list:',
		
		enter: function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! shared.is_inside_function(state)) return
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(parent.value[0], 'symbol', 'list:')) return
			if (index != 0) return
			query.climb(parents, function(node, index, parents) {
				let parent = query.last(parents)
				let func_name = insert_list(node, index, parents, state, system, document)
				let expression = parse(` (call ${func_name})`)[0]
				parent.value[index] = expression
			})
		}
	}
}

function insert_list(node, index, parents, state, system, document) {
	
	let id = system.state.id_static++
	let func_name = '$list_static_' + id
	let tree = parse(`
	(func ${func_name} (result i32)
		(local $list i32)
		(set_local $list (call $list_new))
		(get_local $list)
	)`)[0]
	tree.value.splice(5, 0, ...list_pushs(node))
	query.append(parents[0], tree)
	document.walk(tree, 0, parents, {})
	return func_name
}

function list_pushs(expression) {
	
	let result = []
	expression.value.forEach(function(each, index) {
		if (index === 0) return
		let expression_ = parse(`\n\t\t(call $list_push (get_local $list))`)[0]
		let value = each
		expression_.value.push(value)
		result.push(expression_)
	})
	return result
}
