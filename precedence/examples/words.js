
let parser = require('../parser')
let lexer = require('../lexer/words')

parser.install({
	transform: require('../transforms/expression'),
	parslets: {
		'expression': require('../parslets/expression'),
		'number': require('../parslets/number'),
		'equals': require('../parslets/equals'),
		'and': require('../parslets/and'),
		'or': require('../parslets/or'),
		'not': require('../parslets/not'),
		'plus': require('../parslets/plus'),
		'minus': require('../parslets/minus'),
		'greater': require('../parslets/greater'),
		'less': require('../parslets/less'),
		'(': require('../parslets/open'),
		')': require('../parslets/close')
	}
})

print(parser.parse(lexer.lex('1 plus 2')))
print(parser.parse(lexer.lex('1 plus 2 and 3 plus 4')))
print(parser.parse(lexer.lex('1 less 2 and 2 less 3')))
print(parser.parse(lexer.lex('3 greater 2 and 2 greater 1')))
print(parser.parse(lexer.lex('1 greater 1 and 1 less ( 1 plus 1 )')))

function print(result) {
	console.log('result: ' + JSON.stringify(result, null, 2))
}
