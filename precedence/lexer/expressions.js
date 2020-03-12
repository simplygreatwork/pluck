
const elements = require('../elements')
const parse = require('../../parser/configurations/sexpressions.js')

module.exports = {
	
	lex: function(string) {
		let tree = parse(string)
		if (false) console.log('tree: ' + JSON.stringify(tree, null, 2))
		return elements(tree)
	}
}
