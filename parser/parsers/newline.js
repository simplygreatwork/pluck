
var p = require('../parsers/core')

module.exports = function(chars) {
	
	return p.char ('\n', function(value) {
		return {
			type: 'newline',
			value: value.char
		}
	})
}
