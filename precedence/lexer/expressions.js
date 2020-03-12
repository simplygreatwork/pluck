
const iterator = require('../iterator')
const parse = require('../../parser/configurations/sexpressions.js')

module.exports = {
	
	lex: function(string) {
		return iterator(parse(string))
	}
}
