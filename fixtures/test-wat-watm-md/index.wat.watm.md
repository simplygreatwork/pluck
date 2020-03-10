- head
```wat

(module
	(memory (import "host" "memory") 1)	
	(func $print_string (param $string i32)
		(call $host_print_string (get_local $string))
	)
)
```
