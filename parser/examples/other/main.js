
const helpers = require('./helpers');
const fs = require('fs');
const parser = require('./src/index.js');
let code = fs.readFileSync('./data/source.code');
let ast = parser(code);
if (false) console.log('ast: ' + JSON.stringify(ast, null, 2));

function walk(statements) {
	
	console.log('(')
	console.group();
	statements.forEach(function(statement) {
		let line = [];
		let list = null;
		statement.forEach(function(element) {
			line.push(`${element.value}(${element.type})`)
			if (element.type == 'list') {
				list = element;
			}
		})
		console.log(line.join(' '));
		if (list) {
			walk(list.statements)
		}
	}.bind(this));
	console.groupEnd();
	console.log(')')
}

walk(ast.statements)

let stack = [];
let context = new Context({});

function execute_block(statements) {
	
	statements.forEach(function(statement) {
		execute_statement(statement)
	})
}

function execute_statement(statement) {

	execute_element(statement, 0, context);
}

function execute_element(statement, index, context) {
	
	if (index < statement.length) {
		console.log(`execute_element: ${statement[index].value}[${index}]`);
		let element = statement[index]
		index++;
		execute_element(statement, index)
	}
}

execute_block(ast.statements)

let slot = new helpers.Slot()
slot.hello();