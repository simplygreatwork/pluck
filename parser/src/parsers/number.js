
var p = require('../parsers/core');

module.exports = function() {
	
	let result = []
	return p.alt ([
		p.str ('-', function(value) {
			result.push(value.str);
			return value.str
		}),
		p.str ('0', function(value) {
			result.push(value.str);
			return value.str
		}),
		p.seq ([
			p.char ('1-9', function(value) {
				result.push(value.char);
				return value.char
			}),
			p.rep (p.char ('0-9', function(value) {
				result.push(value.char);
				return value.char
			}), 0, function(value) {
				return value.rep
			})
		], function(value) {
			return value.seq
		})
	], function(value) {
		let string = result.join('');
		result = [];
		return {
			type: 'number',
			value: string
		};
	})
}
