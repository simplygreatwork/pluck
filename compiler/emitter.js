
function on(key, func) {
	
	this.channels = this.channels || {}
	if (this.channels[key] === undefined) this.channels[key] = []
	this.channels[key].push(func)
	return function() {
		let index = this.channels[key].indexOf(func)
		this.channels[key].splice(index, 1)
	}.bind(this)
}

function once(key, func) {
	
	let off = this.on(key, function() {
		off()
		func(...arguments)
	})
}

function emit(key) {
	
	this.channels = this.channels || {}
	if (this.channels[key]) {
		for (let i = 0, length; i < this.channels[key].length; i++) {
			result = this.channels[key][i].apply(this, Array.from(arguments).splice(1))
			if (result == false) return false
		}
	}
	return true
}

module.exports = {
	on,
	once,
	emit
}
