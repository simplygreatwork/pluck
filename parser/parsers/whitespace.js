
var p = require('../parsers/core')

module.exports = function(chars) {
	
	chars = chars || '\t\r\n '
	return p.rep(
		p.seq([
			p.char(chars, function(value) {
				return value.char
			})
		], function(value) {
			return value.seq.join('')
		}),
		1,
		function(value) {
			return {
				type: 'whitespace',
				value: value.rep.join('')
			}
		}
	)
}
