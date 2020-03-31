
var p = require('../parsers/core')

module.exports = function(chars) {
	
	return p.rep (p.char ('^\n', function(value) {
		return value.char
	}), 1, function(value) {
		return value.rep.join('')
	})
}
