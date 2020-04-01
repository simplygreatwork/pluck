
var test = require('tape')				// https://github.com/substack/tape

let suite = [
	'accepts',
	'callable',
	'compaction',
	'demo',
	'dollarize',
	'equals-and',
	'experimental',
	'if-else',
	'if',
	'index',
	'macros',
	'maps',
	'memory',
	'negation',
	'objects',
	'operators',
	'repeat',
	'spawn',
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

function run(file_name) {
	
	let root = path.join(process.cwd(), './examples/')
	root = root + (process.argv.length > 0 ? process.argv[0] : 'index')
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
