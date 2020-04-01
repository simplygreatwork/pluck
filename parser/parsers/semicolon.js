
var p = require('../parsers/core')

module.exports = function(chars) {
	
	return p.char (';', function(value) {
		return {
			type: 'semicolon'
		}
	})
}
