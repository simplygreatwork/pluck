
const fs = require('fs')
const path = require('path')
const jetpack = require('fs-jetpack')
const Document = require('./document')
const Table = require('./table')
const Bus = require('./bus')
const process_ = require('./process')
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
	
	compile(root) {
		
		this.project = this.project_name(root)
		this.load_document(root)
		this.resolve_documents()
		this.sort_documents()
		this.render_function_imports()
		this.transform_documents()
		this.compile_documents()
		this.package_documents()
	}
	
	run(root) {
		
		this.project = this.project_name(root)
		this.unpackage_documents()
		this.instantiate_documents()
		this.imports.host.imports = this.imports
		this.start()
	}
	
	project_name(root) {
		
		let array = root.split('.')
		array.pop()
		return path.basename(array.join(''))
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
		
		Object.keys(this.documents).forEach(function(key) {
			let document = this.documents[key]
			document.module_imports.forEach(function(each, index) {
				document.module_imports[index] = this.documents[each]
			}.bind(this))
		}.bind(this))
	}
	
	sort_documents() {
		
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
		
		for (let document of this.set.values()) {
			process_.render_function_imports(document)
		}
	}
	
	transform_documents() {
		
		for (let document of this.set.values()) {
			let transform = require('./transform')(this, document)
			document.walk = transform.walk
			document.source = transform.transform()
			broadcast.emit('document.transformed', document)
		}
		broadcast.emit('documents.transformed')
	}
	
	compile_documents() {
		
		for (let document of this.set.values()) {
			document.wasm = process_.compile(document).buffer
			let path_ = path.join(process.cwd(), 'build', this.project, document.long_id + '.wasm')
			jetpack.write(path_, '')
			require('fs').writeFileSync(path_, document.wasm)
			broadcast.emit('document.compiled', document)
		}
		broadcast.emit('documents.compiled')
	}
	
	package_documents() {
		
		let path_ = path.join(process.cwd(), 'build', this.project + '/build.json')
		jetpack.write(path_, {
			modules: Array.from(this.set)
			.map(function(document) {
				return document.long_id + '.wasm'
			})
		})
	}
	
	unpackage_documents() {
		
		this.set = new Set()
		let path_ = path.join(process.cwd(), 'build', this.project + '/build.json')
		let config = jetpack.read(path_, 'json')
		config.modules.forEach(function(path_) {
			let document = new Document(path_)
			document.long_id = path_.split('.')[0]
			document.id = document.long_id.split('-')[1]
			this.set.add(document)
		}.bind(this))
	}
	
	instantiate_documents() {
		
		for (let document of this.set.values()) {
			let path_ = path.join(process.cwd(), 'build', this.project, document.long_id + '.wasm')
			document.wasm = require('fs').readFileSync(path_)
			this.imports[document.id] = process_.instantiate(document, this.imports)
			broadcast.emit('document.instantiated', document)
		}
		broadcast.emit('documents.instantiated')
	}
	
	start() {
		
		let array = Array.from(this.set)
		let document = array[array.length - 1]
		document.instance.exports.main()
	}
	
	fire(message, data) {
		this.bus.emit(message, data)
	}
}

module.exports = System