
let lexer = require('../lexer/expressions')
let parser = require('../parser')({
	transform: require('../transforms/expression'),
	parslets: {
		'expression:': require('../parslets/expression'),
		'number:': require('../parslets/number'),
		'symbol:equals': require('../parslets/equals'),
		'symbol:and': require('../parslets/and'),
		'symbol:or': require('../parslets/or'),
		'symbol:not': require('../parslets/not'),
		'symbol:plus': require('../parslets/plus'),
		'symbol:minus': require('../parslets/minus'),
		'symbol:greater': require('../parslets/greater'),
		'symbol:less': require('../parslets/less'),
		'symbol:(': require('../parslets/open'),
		'symbol:)': require('../parslets/close'),
	}
})

print(parser.parse(lexer.lex('one two three')))
// print(parser.parse(lexer.lex('1 plus 2')))
// print(parser.parse(lexer.lex('1 plus 2 and 3 plus 4')))
// print(parser.parse(lexer.lex('1 less 2 and 2 less 3')))
// print(parser.parse(lexer.lex('3 greater 2 and 2 greater 1')))
// print(parser.parse(lexer.lex('1 greater 1 and 1 less ( 1 plus 1 )')))

function print(result) {
	console.log('result: ' + JSON.stringify(result, null, 2))
}
