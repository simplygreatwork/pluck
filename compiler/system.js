
const fs = require('fs')
const path = require('path')
const Document = require('./document')
const Table = require('./table')
const Bus = require('./bus')
const process = require('./process')
const logger = require('./logger')()
const broadcast = require('./broadcast')

class System {
	
	constructor(options) {
		
		Object.assign(this, options)
		this.documents = {}
		this.table = new Table(this)
		this.bus = new Bus()
		this.string_counter = 0
	}
	
	start(path_) {
		
		this.load_document(path_)
		this.resolve_documents()
		this.sort_documents()
		this.render_function_imports()
		this.transform_documents()
		this.instantiate_documents()
	}
	
	load_document(path_) {
		
		if (! this.documents[path_]) {
			let document = new Document(path_)
			document.load()
			broadcast.emit('loaded', path.basename(path_) + ' (' + path_ + ')')
			document.module_imports.forEach(function(each) {
				this.load_document(each)
			}.bind(this))
			this.documents[path_] = document
		}
	}
	
	resolve_documents() {
		
		logger('system').log('resolve_documents')
		Object.keys(this.documents).forEach(function(key) {
			let document = this.documents[key]
			document.module_imports.forEach(function(each, index) {
				document.module_imports[index] = this.documents[each]
			}.bind(this))
		}.bind(this))
	}
	
	sort_documents() {
		
		logger('system').log('sort_documents')
		let documents = Object.values(this.documents)
		let document = null
		this.set = new Set()
		while (document = documents.shift()) {
			let satisfied = true
			document.module_imports.forEach(function(each) {
				if (! this.set.has(each)) {
					satisfied = false
				}
			}.bind(this))
			if (satisfied) {
				this.set.add(document)
			} else {
				documents.push(document)
			}
		}
	}
	
	render_function_imports() {
		
		logger('system').log('render_function_imports')
		for (let document of this.set.values()) {
			process.render_function_imports(document)
		}
	}
	
	transform_documents() {
		
		for (let document of this.set.values()) {
			let transform = require('./transform')(document, this)
			document.walk = transform.walk
			document.source = transform.transform()
			broadcast.emit('transformed', document)
		}
		broadcast.emit('transpiled')
	}
	
	instantiate_documents() {
		
		for (let document of this.set.values()) {
			logger('system').log('instantiate: ' + path.basename(document.path) + ' (' + document.path + ')')
			let name = path.basename(document.path)
			let key = name.split('.')[0]
			let imports = this.imports
			this.imports[key] = process.instantiate(document, imports)
		}
		broadcast.emit('compiled')
	}
	
	fire(message, data) {
		this.bus.emit(message, data)
	}
}

module.exports = System