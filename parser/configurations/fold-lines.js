
var p = require('../parsers/core')

module.exports = function(value) {
	
	let result = []
	value.forEach(function(each, index) {
		if (each.type == 'line') {
			if (each.value.length > 0 && each.value[0].type != 'symbol') {
				each.value[0].whitespace = each.whitespace_
				result.push(...each.value)
			} else {
				if (index === 0) {
					each.value[0].whitespace = each.whitespace_
					result.push(...each.value)
				} else {
					let significant = each.value.filter(function(each) {
						if (each.type == 'whitespace') return false
						else if (each.type == 'newline') return false
						else if (each.type == 'comment') return false
						else return true
					})
					if (significant.length > 0) {			// line contains significant elements
						each.type = 'expression'
						if (each.whitespace_) each.whitespace = each.whitespace_
						result.push(each)
					} else {
						result.push(...each.value)
					}
				}
			}
		} else {
			result.push(each)
		}
	})
	return result
}
