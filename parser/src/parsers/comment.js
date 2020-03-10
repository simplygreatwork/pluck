
var p = require('../parsers/core');

module.exports = function(string) {
	
	string = string || '//';
	let result = [];
	return p.seq ([
		p.str(string, function(value) {
			return value.str
		}),
		p.rep (
			p.char ('^\n', function(value) {
				return value.char;
			}),
			0,
			function(value) {
				return value.rep
			}
		),
	], function(value) {
		return {
			type: 'comment',
			value: value.seq[0] + value.seq[1].join('') + '\n'		// without newline, WASM parser can fail
		}
	})
}
