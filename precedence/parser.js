
module.exports = function(config) {
	
	let parslets = null
	let iterator = null
	let installed = { transform: require('./transforms/default') }
	Object.assign(installed, config)
	
	function bp (token) {
		return token.type ? find(token).bp : 0
	}
	
	function nud (token) {
		return find(token).nud(token, bp(token))
	}
	
	function led (left, token) {
		return find(token).led(left, token, bp(token))
	}
	
	function find(token) {
		return parslets[token.type + ':' + token.value] || parslets[token.type + ':']
	}
	
	function parse() {
		
		if (iterator.peek().type != null) {
			let token = iterator.next()
			let peek = iterator.peek()
			if (peek.type != null && peek.value)
			console.log('token: ' + JSON.stringify(token))
			parse()
		}
	}
	
	function parse_2() {
		
		let token = iterator.peek(1)
		if (parslets[token.type + ':' + token.value] !== undefined) {
			return [parse()]
		} else {
			let token = iterator.next()
			let result = []
			if (token.type != null) {
				console.log('token: ' + JSON.stringify(token))
				result = parse()
				result.unshift(token)
			}
			if (token.type != null) return 
		}
	}
	
	function expression(rbp) {
		
		rbp = rbp || 0
		let token = iterator.next()
		let left = nud(token)
		while (true) {
			let next = iterator.peek()
			console.log('next: ' + JSON.stringify(next))
			if (bp(next) > rbp) {
				token = iterator.next()
				left = led(left, token)
			} else {
				break
			}
		}
		return left
	}
	
	return {
		
		parse: function(iterator_) {
			
			iterator = iterator_
			parslets = {}
			Object.keys(installed.parslets).forEach(function(key) {
				parslets[key] = installed.parslets[key](parse, iterator, installed.transform, config)
			})
			return parse()
		}
	}
}

/*

if (1 plus 1 greater 2 minus 1 and true)

*/


