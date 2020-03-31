
var p = require('../parsers/core')

module.exports = function(head, between, tail, transform) {
	
	transform = transform || function(value) {
		return value;
	}
	
	return p.seq([
		head,
		between,
		tail
	], function(value) {
		return transform(value.seq[1])
	})
}
