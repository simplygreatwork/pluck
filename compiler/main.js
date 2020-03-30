
const path = require('path')
const Runner = require('./runner') 
const jetpack = require('fs-jetpack') 

console.log('Running pluck with node version: ' + process.version)
process.argv.shift()
process.argv.shift()

let command = 'compile'
if (process.argv[0] == 'compile') {
	command = 'compile'
	process.argv.shift()
} else if (process.argv[0] == 'run') {
	command = 'run'
	process.argv.shift()
}

let root = path.join(process.cwd(), './examples/')
if (process.argv.length > 0) {
	root = root + process.argv[0]
} else {
	root = root + 'index'
}
if (! jetpack.exists(root)) {
	console.error('File was not found. Exiting.')
	process.exit(-1)
}
if (! root.endsWith('.watm')) {
	root = root + '.watm'
}

let runner = new Runner()
if (command == 'compile') {
	runner.compile(root)
	runner.run(root)
} else {
	runner.run(root)
}
