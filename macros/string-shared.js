
const query = require('../compiler/query')
const parse = require('../compiler/parse')

function string_call(parent, node, func_name) {
	
	let tree = parse(` (call ${func_name})`)
	query.replace(parent, node, tree[0])
}

function function_new(node, string, system) {
	
	let id = system.string_id++
	let func_name = '$string_static_' + id
	let ast = parse(`
	(func ${func_name} (result i32)
		(local $string i32)
		(set_local $string (i32.const 0))
		;;(set_local $string (call $system_string_static (i32.const ${id})))
		(if (i32.eq (get_local $string) (i32.const 0)) (then
			(set_local $string (call $string_new (i32.const ${string.length})))
			${string_char_sets(string)}
			(call $system_string_static_set (i32.const ${id}) (get_local $string))
		))
		(get_local $string)
	)`)
	query.append(node, ast[0])
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

module.exports = {
	string_call,
	function_new,
	string_char_sets
}
