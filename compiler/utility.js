
module.exports = {
	
	iterate: function(array, func) {
		
		let index = 0
		for (index = 0; index < array.length; index++) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	}
}
