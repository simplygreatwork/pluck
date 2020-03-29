
const path = require('path')

console.log('Running pluck with node version: ' + process.version)
process.argv.shift()
process.argv.shift()
let root = path.join(process.cwd(), './examples/')
if (process.argv.length > 0) {
	root = root + process.argv[0]
} else {
	root = root + 'index'
}
if (! root.endsWith('.watm')) {
	root = root + '.watm'
}
let Runner = require('./runner') 
let runner = new Runner()
runner.run(root)
