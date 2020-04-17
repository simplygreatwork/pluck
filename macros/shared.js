
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const iterate = require('../compiler/utility').iterate

function is_inside_function(state) {
	return state.func ? true : false
}

function is_callable(document, symbol) {
	
	if (document.function_cache === undefined) {
		document.function_cache = {}
		iterate(document.functions, function(node) {
			if (query.is_type(node.value[1], 'symbol')) {
				node.value[1].value = dollarize(node.value[1].value)
				document.function_cache[node.value[1].value] = true
			}
		})
		iterate(Object.keys(document.function_imports), function(module_) {
			iterate(Object.keys(document.function_imports[module_]), function(key) {
				let node = document.function_imports[module_][key]
				if (node.value[3].value[0].value == 'func') {
					key = dollarize(key)
					document.function_cache[key] = true
				}
			})
		})
	}
	return document.function_cache[symbol]
}

function find_locals(state) {
	
	let elements = []
	let offset = 0
	iterate(state.func.value, function(each, index) {
		if (index <= 1) return true								// e.g. func $name
		let first = each.value[0]
		let second = each.value[1]
		if (query.is_type_value(first, 'symbol', 'param')) {
			elements.push(second.value)
			return true
		} else if (query.is_type_value(first, 'symbol', 'result')) {
			return true
		} else if (query.is_type_value(first, 'symbol', 'local')) {
			elements.push(second.value)
			return true
		} else {
			offset = index
			return false
		}
	})
	return {
		elements,
		offset
	}
}

function is_local(state, value) {
	
	if (state.locals) {
		return state.locals.elements.indexOf(value) > -1 ? true : false
	} else {
		return false
	}
}

function dollarize(symbol) {
	
	return (symbol.charAt && symbol.charAt(0) == '$') ? symbol : '$' + symbol
}

function declare(value, state) {
	
	if (is_local(state, value)) return 
	let tree = parse (`
	\t(local ${value} i32)
	`)[0]
	query.insert(state.func, tree, state.locals.offset)
	state.func.emit('inserted', state.locals.offset)
	state.locals = find_locals(state)
}

module.exports = {
	is_inside_function,
	find_locals,
	is_local,
	is_callable,
	dollarize,
	declare
}
