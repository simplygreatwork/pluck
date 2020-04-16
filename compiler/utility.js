
module.exports = {
	
	iterate: function(array, func) {
		
		for (let index = 0, length = array.length; index < length; index++) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	},
	
	backward: function(array, func) {
		
		for (let index = array.length - 1; index >- 0; index--) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	},
	
	truncate_extensions: function(path_) {
		
		return path_.split('.')[0]
	},
	
	is_uppercase: function(value) {
		
		let result = false
		if (value.length > 0) {
			let char = value.charAt(0)
			result = (/^[A-Z]+$/.test(char))
		}
		return result
	}
}
