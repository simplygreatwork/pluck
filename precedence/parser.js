
let parslets = null
let elements = null
let installed = { transform: require('./transforms/default') }

function bp (token) {
	
	if (! token.type) {
		return 0
	} else {
		return parslets[token.type].bp
	}
}

function nud (token) {
	return parslets[token.type].nud(token, bp(token))
}

function led (left, token) {
	return parslets[token.type].led(left, token, bp(token))
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

module.exports = {
	
	install: function(options) {
		Object.assign(installed, options)
	},
	
	parse: function(elements_) {
		
		elements = elements_
		parslets = {}
		Object.keys(installed.parslets).forEach(function(key) {
			parslets[key] = installed.parslets[key](parse, elements, installed.transform)
		})
		return parse()
	}
}
