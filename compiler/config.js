
module.exports = {
	
	prelink: [
		require('../macros/func-prelink'),
		require('../macros/function-prelink'),
		require('../macros/accepts'),
	],
	postlink: [
		require('../macros/system'),
		require('../macros/system-object'),
		require('../macros/directive'),
		require('../macros/expression'),
		require('../macros/evaluate'),
		require('../macros/string'),
		require('../macros/string-literal'),
		require('../macros/number'),
		require('../macros/number-literal'),
		require('../macros/boolean'),
		require('../macros/boolean-literal'),
		require('../macros/name'),
		require('../macros/symbol'),
		require('../macros/set'),
		require('../macros/set_local'),
		require('../macros/get'),
		require('../macros/dollarize'),
		require('../macros/callable'),
		require('../macros/import'),
		require('../macros/export'),
		require('../macros/typeof'),
		require('../macros/ref'),
		require('../macros/func'),
		require('../macros/function'),
		require('../macros/accepts'),
		require('../macros/repeat'),
		require('../macros/break'),
		require('../macros/return'),
		require('../macros/if'),
		require('../macros/else'),
		require('../macros/plus'),
		require('../macros/minus'),
		require('../macros/equals'),
		require('../macros/greater'),
		require('../macros/less'),
		require('../macros/not'),
		require('../macros/and'),
		require('../macros/or'),
		require('../macros/xor'),
		require('../macros/omit')
	]
}
