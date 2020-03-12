
module.exports = function(options) {
	
	let parslets = null
	let iterator = null
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
		let token = iterator.next()
		let left = nud(token)
		while (true) {
			let next = iterator.peek()
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
				parslets[key] = installed.parslets[key](parse, iterator, installed.transform)
			})
			return parse()
		}
	}
}
