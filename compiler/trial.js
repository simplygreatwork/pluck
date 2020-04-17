
const fs = require('fs')
const path = require('path')
const parse = require('./parse')
const walk = require('./walk')
const print = require('./print')
const logger = require('./logger')()
const remark = require('remark')
const visit = require('unist-util-visit')

function test_one() {
	
	let code = `
	(module
		(import "utility" "print_string" 
			(func $print_string 
				(param i32)))
		(import "utility" "print_string" 
			(func $print_string 
				(param i32)))
		(import "utility" "print_string" 
			(func $print_string 
				(param i32)))
	)
	`
	let ast = parse(code)
	if (false) console.log('ast: ' + JSON.stringify(ast, null, 2))
	code = print(ast)
	console.log('code: ' + code)
}

function test_two() {
	
	let code = `
	(module
		(import "utility" "print_string" (func $print_string (param i32)))
	)`
	let tree = parse(code)
	walk({ root: tree[0], visit: function(node, index, parents) {
		console.log('node: ' + JSON.stringify(node, null, 2))
	}})
}

function test_three() {
	
	let code = `
	(module
		(func $test_string_macro	
			(set_local $string (string: "Hello from a string macro!"))
		)	
	)`
	let root = path.join(process.cwd(), '/src/wat/examples/index.wat.watm')
	code = fs.readFileSync(root) + ''
	let ast = parse(code)
	code = require('./transform')(ast)
	console.log('code: ' + code)
}

function test_markdown() {
	
	let path_ = path.join(process.cwd(), '/src/fixtures/test-wat-watm-md-sections/index.wat.watm.md')
	let text = fs.readFileSync(path_) + ''
	let tree = remark().parse(text)
	let result = []
	let once = false
	visit(tree, function(node) {
		if (node.type == 'code') {
			result.push('\n')
			result.push(node.value)
		}
	}.bind(this))
	result = result.join('')
	console.log('result: ' + result)
}

module.exports = {
	test_one : test_one,
	test_two : test_two,
	test_three : test_three,
	test_markdown : test_markdown
}

test_one()
test_two()
test_three()
test_markdown()
