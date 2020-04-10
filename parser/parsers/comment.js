
var p = require('../parsers/core')

module.exports = function(string) {
	
	string = string || '//'
	return p.seq ([
		p.str (string),
		p.rep (
			p.char ('^\n'), 1
		),
	], function(value) {
		return {
			type: 'comment',
			value: value[0] + value[1].join('') + '\n'		// without newline, WASM parser can fail
		}
	})
}
