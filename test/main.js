
const fs = require('fs')
const path = require('path')
const jetpack = require('fs-jetpack')
const test = require('tape')				// https://github.com/substack/tape

jetpack.remove(path.join(process.cwd(), '../build'))

let suite = [
	'accepts',
	'callable',
	'closures',
	'compaction',
	'demo',
	'dollarize',
	'equals-and',
	'experimental',
	'functions',
	'functions-nested',
	'if-else',
	'if',
	'index',
	'lists',
	'macros',
	'maps',
	'negation',
	'objects',
	'operators',
	'repeat',
	'repeat-if',
	'repeat-nested',
	'threads',
	'stress',
	'stress2',
	'stress3',
	'string',
	'tiny'
]
suite.forEach(function(each, index) {
	
	test(each, function(tape) {
		
		execute(`cd .. && npm start ${each}`, function(result) {
			if (result.error) {
				tape.error(result.error, result.error)
			} else {
				tape.pass(`"${each}" has completed`)
			}
			tape.end()
		})
	})
})

function execute(command, callback) {
	
	require('child_process').exec(command, function(error, stdout, stderr) {
		
		callback({
			error : error,
			stdout: stdout,
			stderr: stderr
		})
	})
}

function run(subject) {
	
	process.chdir('../');
	let root = path.join(process.cwd(), './examples/')
	root = root + subject
	root = root + (! root.endsWith('.wat.watm' > 0) ? '.wat.watm' : '')
	if (! jetpack.exists(root)) {
		console.error('')
		console.error('>>>>> The file was not found so exiting now. <<<<<')
		console.error('')
		process.exit(0)
	}
	let runner = new Runner()
	runner.compile(root)
	runner.run(root)
}
