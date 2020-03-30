
var p = require('../parsers/core')

module.exports = function(value) {
	
	let whitespace = []
	value.map(function(each) {
		if (each.type == 'whitespace') whitespace.push(each.value)
		else if (each.type == 'newline') whitespace.push(each.value)
		else if (each.type == 'comment') whitespace.push(each.value)
		else {
			each.whitespace = whitespace.join('')
			whitespace.splice(0, whitespace.length)
		}
	})
	return value.filter(function(each) {
		if (each.type == 'whitespace') return false
		else if (each.type == 'newline') return false
		else if (each.type == 'comment') return false
		else return true
	})
}
