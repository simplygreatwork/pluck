
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
		return this.project
	}
	
	run(root) {
		
		this.project = this.project_name(root)
		this.unpackage_documents()
		this.instantiate_documents()
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
		
		this.paths = []
		for (let document of this.set.values()) {
			document.wasm = process_.compile(document).buffer
			this.paths.push(document.id + '.wasm')
			let path_ = path.join(process.cwd(), 'build', this.project, document.id + '.wasm')
			jetpack.write(path_, '')
			require('fs').writeFileSync(path_, document.wasm)
			broadcast.emit('document.compiled', document)
		}
		broadcast.emit('documents.compiled')
	}
	
	package_documents() {
		
		let array = Array.from(this.set)
		let document = array[array.length - 1]
		let build = path.join(process.cwd(), 'build', this.project + '/build.json')
		jetpack.write(build, {
			modules: this.paths
		})
	}
	
	unpackage_documents() {
		
		this.documents = {}
		this.set = new Set()
		let build = path.join(process.cwd(), 'build', this.project + '/build.json')
		let config = jetpack.read(build, 'json')
		config.modules.forEach(function(path_) {
			let document = new Document(path_)
			this.set.add(document)
			this.documents[path_] = document
		}.bind(this))
	}
	
	instantiate_documents() {
		
		for (let document of this.set.values()) {
			logger('system').log('instantiate: ' + path.basename(document.path) + ' (' + document.path + ')')
			let path_ = path.join(process.cwd(), 'build', this.project, document.path + '.wasm')
			document.wasm = require('fs').readFileSync(path_)
			let name = path.basename(document.path)
			let key = name.split('.')[0]
			this.imports[key] = process_.instantiate(document, this.imports)
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