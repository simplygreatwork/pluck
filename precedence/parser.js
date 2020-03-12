
module.exports = function(options) {
	
	let parslets = null
	let elements = null
	let installed = { transform: require('./transforms/default') }
	Object.assign(installed, options)
	
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
	
	function parse (rbp) {
		
		rbp = rbp || 0
		let token = elements.next()
		let left = nud(token)
		while (true) {
			let next = elements.peek()
			if (bp(next) > rbp) {
				token = elements.next()
				left = led(left, token)
			} else {
				break
			}
		}
		return left
	}
	
	return {
		
		parse: function(elements_) {
			
			elements = elements_
			parslets = {}
			Object.keys(installed.parslets).forEach(function(key) {
				parslets[key] = installed.parslets[key](parse, elements, installed.transform)
			})
			return parse()
		}
	}
}
