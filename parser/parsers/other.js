
var p = require('../parsers/core')

module.exports = function(chars) {
	
	return p.rep (
		p.char ('^\n'),
		1,
		function(value) {
			return value.join('')
		}
	)
}
