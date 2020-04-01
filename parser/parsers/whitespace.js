
var p = require('../parsers/core')

module.exports = function(chars) {
	
	chars = chars || '\t\r\n '
	
	return p.rep (
		p.seq ([
			p.char (chars)
		], function(value) {
			return value.join('')
		}),
		1,
		function(value) {
			return {
				type: 'whitespace',
				value: value.join('')
			}
		}
	)
}
