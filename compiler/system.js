
const fs = require('fs')
const path = require('path')
const jetpack = require('fs-jetpack')
const Document = require('./document')
const Table = require('./table')
const Transform = require('./transform')
const Bus = require('./bus')
const process_ = require('./process')
const print = require('./print')
const logger = require('./logger')()
const broadcast = require('./broadcast')
const utility = require('./utility')

class System {
	
	constructor(options) {
		
		Object.assign(this, options)
		this.documents = {}
		this.table = new Table(this)
		this.bus = new Bus()
		this.static_id = 0
		this.string_id = 0
	}
	
	compile(root) {
		
		this.root = process.cwd()
		this.project = this.project_name(root)
		this.load(root)
		this.resolve()
		this.sort()
		this.post_process()
		this.compile_()
		this.package_()
	}
	
	run(root) {
		
		this.project = this.project_name(root)
		this.unpackage()
		this.instantiate()
		this.imports.host.imports = this.imports
		this.start()
	}
	
	project_name(root) {
		
		return path.basename(root.split('.')[0])
	}
	
	load(path_) {
		
		if (! this.documents[path_]) {
			let document = new Document(path_, this.root)
			document.load()
			broadcast.emit('loaded', path.basename(path_) + ' (' + path_ + ')')
			process_.transform(this, document, this.macros.prelink)
			process_.link(document)
			document.module_imports.forEach(function(each) {
				this.load(each)
			}.bind(this))
			this.documents[path_] = document
		}
	}
	
	resolve() {
		
		Object.keys(this.documents).forEach(function(key) {
			let document = this.documents[key]
			document.module_imports.forEach(function(each, index) {
				document.module_imports[index] = this.documents[each]
			}.bind(this))
		}.bind(this))
	}
	
	sort() {
		
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
		this.documents = Array.from(this.set)
	}
	
	post_process() {
		
		this.documents.forEach(function(document) {
			broadcast.emit('document.transforming', document)
			process_.render_function_imports(document)
			process_.transform(this, document, this.macros.postlink)
			document.source = print(document.tree)
			broadcast.emit('document.transformed', document)
		}.bind(this))
		broadcast.emit('documents.transformed')
	}
	
	compile_() {
		
		this.documents.forEach(function(document) {
			document.wasm = process_.compile(document).buffer
			let path_ = path.join(process.cwd(), 'build', document.id + '.wasm')
			jetpack.write(path_, '')
			require('fs').writeFileSync(path_, document.wasm)
			broadcast.emit('document.compiled', document)
		}.bind(this))
		broadcast.emit('documents.compiled')
	}
	
	package_() {
		
		let path_ = path.join(process.cwd(), 'build', this.project + '.json')
		jetpack.write(path_, {
			modules: this.documents
			.map(function(document) {
				return document.id + '.wasm'
			})
		})
	}
	
	unpackage() {
		
		this.documents = []
		let path_ = path.join(process.cwd(), 'build', this.project + '.json')
		let config = jetpack.read(path_, 'json')
		config.modules.forEach(function(path_) {
			let document = {}
			document.path = path_
			document.id = utility.truncate_extensions(path_)
			this.documents.push(document)
		}.bind(this))
	}
	
	instantiate() {
		
		this.documents.forEach(function(document) {
			let path_ = path.join(process.cwd(), 'build', document.path)
			document.wasm = require('fs').readFileSync(path_)
			this.imports[document.id] = process_.instantiate(document, this.imports)
			broadcast.emit('document.instantiated', document)
		}.bind(this))
		broadcast.emit('documents.instantiated')
	}
	
	start() {
		this.documents.pop().instance.exports.main()
	}
}

module.exports = System