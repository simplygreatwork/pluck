
module.exports = function pluck(property) {
	
	return function(value) {
		return value[property]
	}
}