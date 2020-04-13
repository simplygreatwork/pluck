
const query = require('../compiler/query')
const parse = require('../compiler/parse')

function string_call(parent, node, func_name) {
	
	let tree = parse(` (call ${func_name})`)[0]
	query.replace(parent, node, tree)
}

function function_new(node, string, system, objectify) {
	
	let id = system.state.id_string++
	let func_name = '$string_static_' + id
	let tree = parse(`
	(func ${func_name} (result i32)
		(local $string i32)
		(set_local $string (call $resource_string_static (i32.const ${id})))
		(if (i32.eq (get_local $string) (i32.const 0)) (then
			(set_local $string (call $string_new (i32.const ${string.length})))
			${string_char_sets(string)}
			${objectify_(objectify, system)}
			(call $resource_string_static_set (i32.const ${id}) (get_local $string))
		))
		(get_local $string)
	)`)[0]
	query.append(node, tree)
	return func_name
}

function string_char_sets(string) {
	
	let result = []
	string.split('').forEach(function(char, index) {
		let char_code = string.charCodeAt(index)
		result.push(`\t\t(call $string_char_set (get_local $string) (i32.const ${index}) (i32.const ${char_code}))`)
	})
	return result.join('\n')
}

function objectify_(objectify, system) {
	
	if (objectify && system.objectify) {
		return `(set_local $string (call $object_string_from_string (get_local $string)))`
	} else {
		return ''
	}
}

module.exports = {
	string_call,
	function_new,
	string_char_sets
}
