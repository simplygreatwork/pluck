
const path = require('path')
const minimist = require('minimist') 
const jetpack = require('fs-jetpack') 
const Runner = require('./runner') 

var options = options_()
var root = root_(options)
inform(options)

let runner = new Runner()
if (options.clean) runner.clean(root)
if (options.compile) runner.compile(root)
if (options.run) runner.run(root)

function options_() {
	
	var options = minimist(process.argv.slice(2), {
		boolean: ['clean', 'compile', 'run'],
		alias: { x: 'clean', c: 'compile', r: 'run' },
		default: { clean: false, compile: true, run: true }
	})
	if (options._.length === 0) options._ = ['index']
	options.subject = options._[0]
	return options
}

function root_(options) {
	
	let root = path.join(process.cwd(), './examples/')
	root = root + options.subject
	root = root + (! root.endsWith('.wat.watm' > 0) ? '.wat.watm' : '')
	if (! jetpack.exists(root)) {
		console.error('')
		console.error('>>>>> The file was not found so exiting now. <<<<<')
		console.error('')
		process.exit(1)
	}
	return root
}

function inform(options) {
	
	console.log('')
	console.log('Running pluck with node version: ' + process.version)
	console.log('')
}
