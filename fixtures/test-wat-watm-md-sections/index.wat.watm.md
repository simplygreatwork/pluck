
- head
```wat

(module
```

- imports
```wat

	(import "host" "print_string" (func $host_print_string (param i32)))
	(import "host" "print_integer" (func $host_print_integer (param i32)))
	(memory (import "host" "memory") 1)
```

- functions
```wat
	
	(func $print_string (param $string i32)
		(call $host_print_string (get_local $string))
	)

	(func $print_integer (param $pointer i32)
		(call $host_print_integer (get_local $pointer))
	)

	(func $swap_test (param $reference_a i32) (param $reference_b i32)	;; need to use compiler
		
		(local $a i32)
		(local $b i32)
		(local $temp i32)
		(set_local $a (i32.const 1))
		(set_local $a (i32.const 2))
		(set_local $temp (get_local $a))
		(set_local $a (get_local $b))
		(set_local $b (get_local $temp))
	)
```

- exports
```wat

	(export "print_string" (func $print_string))
	(export "print_integer" (func $print_integer))
```

- tail
```wat

)
```