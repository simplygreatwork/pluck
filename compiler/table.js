
const fs = require('fs')
const path = require('path')
const parse = require('./parse')
const query = require('./query')
const print = require('./print')
const process = require('./process')

class Table {
	
	constructor(system) {
		
		this.system = system
		this.counter = 4096
		this.elements = {}
	}
	
	find_function_id(module_, function_) {
		
		let key = module_ + '/' + function_
		if (this.elements[key] === undefined) {
			let document = process.find_document(this.system, module_)
			if (document) {
				let func = process.find_function(document, function_)
				if (func) {
					this.elements[key] = this.counter++
					let id = this.elements[key]
					let code = `\n\t(elem (i32.const ${id}) ${function_})`
					let tree = parse(code)
					query.append(document.tree[0], tree[0])
				}
			}
		}
		return this.elements[key]
	}
	
	find_function(module_, function_) {					// find a new location for this function
		
		let key = module_ + '/' + function_
		let document = process.find_document(this.system, module_)
		if (document) {
			let func = process.find_function(document, function_)
			return func
		}
	}
}

module.exports = Table