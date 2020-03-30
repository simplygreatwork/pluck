
var p = require('../parsers/core');

module.exports = function() {
	
	let result = [];
	return p.seq ([
		p.str ('"', function(value) {
			return value.str
		}),
		p.rep (
			p.char ('-+\/\\\\=$:,<>!_.\(\)a-zA-Z0-9 \t', function(value) {
				return value.char;
			}),
			0,
			function(value) {
				return value.rep
			}
		),
		p.str ('"', function(value) {
			return value.str
		}),
	], function(value) {
		return {
			type: 'string',
			value: value.seq[1].join('')
		}
	})
}
