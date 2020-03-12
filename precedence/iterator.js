
const eof = { type: null, match: null }

class Iterator {
	
	constructor(tokens) {
		
		this.tokens = tokens
		this.position = 0
	}
	
	peek() {
		return this.tokens[this.position] || eof
	}
	
	next() {
		return this.tokens[this.position++] || eof
	}
	
	expect(value) {
		
		const token = this.next()
		if (value != token.value) throw new Error(`Unexpected token: ${token.value || '<<eof>>'}`)
	}
	
	eof() {
		return this.position >= this.tokens.length
	}
}

module.exports = function (array) {
	
	return new Iterator(array)
}
