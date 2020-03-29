
const path = require('path')
const jetpack = require('fs-jetpack')
const logger = require('./logger')([
	'runner', 'system', 'document-off', 'process', 'transform-off',
	'stager-off', 'loading', 'parsing-off', 'transforming'
])
const broadcast = require('./broadcast')
const System = require('./system')
const Host = require('./host')

class Runner {
	
	run(root) {
		
		logger('runner').log('root module: ' + root)
		this.listen()
		this.system = new System({
			imports: {
				host: new Host()
			},
			macros: require('./config')
		})
		this.date = new Date()
		this.system.compile(root)
		this.system.run(this.system.main)
	}
	
	listen() {
		
		broadcast.on('parsed', function(data) {
			logger('parsing').log('parsed: ' + data)
		}.bind(this))
		broadcast.on('loaded', function(data) {
			logger('loading').log('loaded: ' + data)
		}.bind(this))
		broadcast.on('document.transformed', function(document) {
			logger('transforming').log('transformed: ' + document.id)
			let path_ = path.join(process.cwd(), 'work', document.path) 
			jetpack.write(path_, document.source)
		}.bind(this))
		broadcast.on('documents.transformed', function(document) {
			logger('runner').log('Transformed in ' + ((new Date().getTime() - this.date.getTime()) / 1000) + ' seconds.')
		}.bind(this))
		broadcast.on('document.compiled', function(document) {
			let path_ = path.join(process.cwd(), 'work', document.path + '.wasm')
			require('fs').writeFileSync(path_, document.wasm)
		}.bind(this))
		broadcast.on('documents.compiled', function(document) {
			logger('runner').log('Compiled in ' + ((new Date().getTime() - this.date.getTime()) / 1000) + ' seconds.')
		}.bind(this))
		broadcast.on('documents.instantiated', function(document) {
			logger('runner').log('Instantiated in ' + ((new Date().getTime() - this.date.getTime()) / 1000) + ' seconds.')
		}.bind(this))
	}
}

module.exports = Runner