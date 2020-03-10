
Emitter = {
	
	on(key, func) {
		
		this.channels = this.channels || {}
		if (this.channels[key] === undefined) this.channels[key] = []
		this.channels[key].push(func)
		return function() {
			let index = this.channels[key].indexOf(func)
			this.channels[key].splice(index, 1)
		}.bind(this)
	},
	
	emit(key) {
		
		this.channels = this.channels || {}
		if (this.channels[key]) {
			for (let i = 0, length = this.channels[key].length; i < length; i++) {
				result = this.channels[key][i].apply(this, Array.from(arguments).splice(1))
				if (result == false) return false
			}
		}
		return true
	}
}

class Mixin {
	
	static use() {
		
		let base = arguments[0]
		let mixins = Array.from(arguments).splice(1)
		let class_ = class extends base {}
		mixins.forEach(function(mixin) {
			Object.assign(class_.prototype, mixin)
		});
		return class_
	}
}

class Bus extends Mixin.use(Object, Emitter) {
	
	constructor(options) {
		
		super()
		options = options || {}
		this.name = options.name
		this.parent = options.parent
	}
}

module.exports = Bus
