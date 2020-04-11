
const fs = require('fs')
const path = require('path')
const jetpack = require('fs-jetpack')
const parse = require('./parse')
const query = require('./query')
const print = require('./print')
const process_ = require('./process')

class Table {
	
	constructor(system, state) {
		
		this.system = system
		this.path_ = path.join(process.cwd(), 'build', 'table.json')
		this.index = {}
		this.counter = 4096
		this.cached = state
	}
	
	find_function_id(module_, function_) {
		
		let key = module_ + '/' + function_
		if (this.index[key] === undefined) {
			let document = process_.find_document(this.system, module_)
			if (document) {
				let func = process_.find_function(document, function_)
				if (func) {
					if (this.cached.index_table[key] === undefined) {
						this.cached.index_table[key] = this.cached.id_table++
					}
					let id = this.index[key] = this.cached.index_table[key]
					let code = `\n\t(elem (i32.const ${id}) ${function_})`
					let tree = parse(code)
					query.append(document.tree[0], tree[0])
				}
			}
		}
		return this.index[key]
	}
	
	find_function(module_, function_) {					// find a new location for this function
		
		let key = module_ + '/' + function_
		let document = process_.find_document(this.system, module_)
		if (document) {
			let func = process_.find_function(document, function_)
			return func
		}
	}
}

module.exports = Table