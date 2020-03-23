
const query = require('../compiler/query')

function is_inside_function(state) {
	return state.func ? true : false
}

function is_callable(document, symbol) {			// todo: also use iteration breaking
	
	if (document.function_cache === undefined) {
		document.function_cache = {}
		document.functions.forEach(function(node) {
			if (query.is_type(node.value[1], 'symbol')) {
				node.value[1].value = dollarize(node.value[1].value)
				document.function_cache[node.value[1].value] = true
			}
		})
		Object.keys(document.function_imports).forEach(function(module_) {
			Object.keys(document.function_imports[module_]).forEach(function(key) {
				let node = document.function_imports[module_][key]
				if (node.value[3].value[0].value == 'func') {
					key = dollarize(key)
					document.function_cache[key] = true
				}
			}.bind(this))
		}.bind(this))
	}
	return document.function_cache[symbol]
}

function find_locals(state) {
	
	let elements = []
	let offset = 0
	state.func.value.every(function(each, index) {
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

module.exports = {
	is_inside_function,
	find_locals,
	is_local,
	is_callable,
	dollarize
}
