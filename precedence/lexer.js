
const eof = {type: null, match: null}

class Lexer {
	
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
	
	expect(type) {
		
		const token = this.next()
		if (type != token.type) throw new Error(`Unexpected token: ${t.match || '<<eof>>'}`)
	}
	
	eof() {
		return this.position >= this.tokens.length
	}
}

module.exports = function (tokens) {
	
	return new Lexer(tokens)
}
