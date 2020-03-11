
module.exports = function (type, left, right) {
	
	if (false) return {type, left, right}
	if (false) return [type, left, right]
	return {
		type: 'expression',
		value: [{
			type: 'symbol',
			value: type
		}, left, right]
	}
}
