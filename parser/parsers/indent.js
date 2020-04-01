
var p = require('../parsers/core')

module.exports = function() {
	
	return p.alt ([
		p.char ('\t'),
		p.str ('   ')
	])
}
