(module

	(import "host" "table" (table 2 anyfunc))
	(import "utility" "print_string" (func $print_string (param i32)))
	(import "utility" "print_integer" (func $print_integer (param i32)))
	(import "memory" "memory_allocate" (func $memory_allocate (param i32) (result i32)))
	(import "memory" "memory_copy" (func $memory_copy (param i32) (param i32) (param i32)))
	(import "string" "string_new" (func $string_new (param i32) (result i32)))
	(import "string" "string_type" (func $string_type (param i32) (result i32)))
	(import "string" "string_length" (func $string_length (param i32) (result i32)))
	(import "string" "string_chars" (func $string_chars (param i32) (result i32)))
	(import "string" "string_set_char" (func $string_set_char (param i32) (param i32) (param i32)))
	(import "string" "string_get_char" (func $string_get_char (param i32) (param i32) (result i32)))
	(import "string" "string_clone" (func $string_clone (param i32) (result i32)))
	(import "string" "string_append" (func $string_append (param i32) (param i32) (result i32)))
	(import "string" "string_equals" (func $string_equals (param i32) (param i32) (result i32)))
	(import "string" "string_index_of" (func $string_index_of (param i32) (param i32) (result i32)))
	(import "number" "number_new" (func $number_new (param i32) (result i32)))
	(import "number" "number_value" (func $number_value (param i32) (result i32)))
	(import "number" "number_add" (func $number_add (param i32) (param i32) (result i32)))
	(import "number" "number_to_string" (func $number_to_string (param i32) (result i32)))
	(import "list" "list_new" (func $list_new (result i32)))
	(import "list" "list_append" (func $list_append (param i32) (param i32)))
	(import "list" "list_iterate" (func $list_iterate (param i32) (param i32)))
	(import "list" "list_length" (func $list_length (param i32) (result i32)))
	(import "list" "item_new" (func $item_new (result i32)))
	(import "list" "item_next" (func $item_next (param i32) (result i32)))
	(import "list" "item_previous" (func $item_previous (param i32) (result i32)))
	(import "list" "item_value" (func $item_value (param i32) (result i32)))
	(import "list" "item_append" (func $item_append (param i32) (param i32)))
	(import "assertion" "assert_string_type" (func $assert_string_type (param i32)))
	(import "assertion" "assert_string_equals" (func $assert_string_equals (param i32) (param i32)))
	(import "assertion" "assert_number_type" (func $assert_number_type (param i32)))
	(import "assertion" "assert_number_equals" (func $assert_number_equals (param i32) (param i32)))
	(import "assertion" "assert_list_type" (func $assert_list_type (param i32)))
	(import "assertion" "assert_list_length" (func $assert_list_length (param i32) (param i32)))
	(import "table" "test_table" (func $test_table))
	(memory (import "host" "memory") 1)
	(data (i32.const 50) "\20------------------------------")
	(data (i32.const 100) "\01\04PASS")
	(data (i32.const 200) "\01\04FAIL")
	(data (i32.const 300) "\01\0cHello World!")
	(data (i32.const 400) "\01\13Alphanumeric string")
	(data (i32.const 500) "\01\11Cloning a string")
	(data (i32.const 600) "\01\16Appending a string")
	(data (i32.const 700) "\01\0EAdding numbers")
	(data (i32.const 750) "\01\19Comparing booleans")
	(data (i32.const 800) "\01\16Creating a list")
	(data (i32.const 850) "\01\16Creating a map")
	(data (i32.const 3000) "\01\16Creating an array")
	(elem (i32.const 0) $test_list_iterate_each)
	
	(func $main
		
		(call $setup)						;; comment
		(call $test_hello_world)
		(call $test_string_alphanum)
		(call $test_string_clone)
		(call $test_string_append)
		(call $test_number_add)
		(call $test_boolean_and)
		(call $test_array)
		(call $test_list)
		(call $test_map)
		(call $test_arguments_dynamic)
		(call $test_table)
	)
	
	(func $setup
		
		(i32.store (i32.const 0) (i32.const 4096))
	)
	
	(func $test_hello_world
		
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 300))
	)
	
	(func $test_string_alphanum
		
		(local $string i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 400))
		(call $print_string (i32.const 50))
		(set_local $string (call $string_new (i32.const 6)))
		(call $string_set_char (get_local $string) (i32.const 0) (i32.const 48))
		(call $string_set_char (get_local $string) (i32.const 1) (i32.const 57))
		(call $string_set_char (get_local $string) (i32.const 2) (i32.const 65))
		(call $string_set_char (get_local $string) (i32.const 3) (i32.const 90))
		(call $string_set_char (get_local $string) (i32.const 4) (i32.const 97))
		(call $string_set_char (get_local $string) (i32.const 5) (i32.const 122))
		(call $print_string (get_local $string))
	)
	
	(func $test_string_clone
		
		(local $string i32)
		(local $string_result i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 500))
		(call $print_string (i32.const 50))
		(set_local $string (call $string_new (i32.const 3)))
		(call $string_set_char (get_local $string) (i32.const 0) (i32.const 97))
		(call $string_set_char (get_local $string) (i32.const 1) (i32.const 98))
		(call $string_set_char (get_local $string) (i32.const 2) (i32.const 99))
		(set_local $string_result (call $string_clone (get_local $string)))
		(call $assert_string_equals (get_local $string) (get_local $string_result))
	)
	
	(func $test_string_append

		(local $string_a i32)
		(local $string_b i32)
		(local $string_result i32)
		(local $string_expected i32)

		(call $print_string (i32.const 50))
		(call $print_string (i32.const 600))
		(call $print_string (i32.const 50))
		(set_local $string_a (call $string_new (i32.const 4)))
		(call $string_set_char (get_local $string_a) (i32.const 0) (i32.const 97))
		(call $string_set_char (get_local $string_a) (i32.const 1) (i32.const 98))
		(call $string_set_char (get_local $string_a) (i32.const 2) (i32.const 99))
		(call $string_set_char (get_local $string_a) (i32.const 3) (i32.const 100))
		(call $print_string (get_local $string_a))
		
		(set_local $string_b (call $string_new (i32.const 5)))
		(call $string_set_char (get_local $string_b) (i32.const 0) (i32.const 101))
		(call $string_set_char (get_local $string_b) (i32.const 1) (i32.const 102))
		(call $string_set_char (get_local $string_b) (i32.const 2) (i32.const 103))
		(call $string_set_char (get_local $string_b) (i32.const 3) (i32.const 104))
		(call $string_set_char (get_local $string_b) (i32.const 4) (i32.const 105))
		(call $print_string (get_local $string_b))
		
		(set_local $string_result (call $string_append (get_local $string_a) (get_local $string_b)))
		(set_local $string_expected (call $string_new (i32.const 9)))
		(call $string_set_char (get_local $string_expected) (i32.const 0) (i32.const 97))
		(call $string_set_char (get_local $string_expected) (i32.const 1) (i32.const 98))
		(call $string_set_char (get_local $string_expected) (i32.const 2) (i32.const 99))
		(call $string_set_char (get_local $string_expected) (i32.const 3) (i32.const 100))
		(call $string_set_char (get_local $string_expected) (i32.const 4) (i32.const 101))
		(call $string_set_char (get_local $string_expected) (i32.const 5) (i32.const 102))
		(call $string_set_char (get_local $string_expected) (i32.const 6) (i32.const 103))
		(call $string_set_char (get_local $string_expected) (i32.const 7) (i32.const 104))
		(call $string_set_char (get_local $string_expected) (i32.const 8) (i32.const 105))
		(call $assert_string_equals (get_local $string_expected) (get_local $string_result))
	)
	
	(func $test_number_add
		
		(local $number_a i32)
		(local $number_b i32)
		(local $number_c i32)
		(local $number_expected i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 700))
		(call $print_string (i32.const 50))
		(set_local $number_a (call $number_new (i32.const 3)))
		(set_local $number_b (call $number_new (i32.const 4)))
		(set_local $number_c (call $number_add (get_local $number_a) (get_local $number_b)))
		(set_local $number_expected (call $number_new (i32.const 7)))
		(call $print_string (call $number_to_string (get_local $number_a)))
		(call $print_string (call $number_to_string (get_local $number_b)))
		(call $print_string (call $number_to_string (get_local $number_c)))
		(call $assert_number_type (get_local $number_c))
		(call $assert_number_equals (get_local $number_c) (get_local $number_expected))
	)

	(func $test_boolean_and
		
		(local $boolean_a i32)
		(local $boolean_b i32)
		(local $boolean_c i32)
		(local $boolean_expected i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 750))
		(call $print_string (i32.const 50))
	)

	(func $test_array
		
		(local $array i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 3000))
		(call $print_string (i32.const 50))
	)

	(func $test_list
		
		(local $list i32)
		(local $item i32)
		(local $test_list_iterate_each i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 800))
		(call $print_string (i32.const 50))
		(set_local $list (call $list_new))
		(set_local $test_list_iterate_each (i32.const 0))
		(call $list_append (get_local $list) (call $test_list_item_generate (i32.const 97)))
		(call $list_append (get_local $list) (call $test_list_item_generate (i32.const 98)))
		(call $list_append (get_local $list) (call $test_list_item_generate (i32.const 99)))
		(call $list_iterate (get_local $list) (get_local $test_list_iterate_each))
		(call $print_string (call $number_to_string (call $list_length (get_local $list))))
		(call $assert_list_type (get_local $list))
		(call $assert_list_length (get_local $list) (call $number_new (i32.const 3)))
	)
	
	(func $test_list_item_generate (param $char_code i32) (result i32)
		
		(local $string i32)
		(set_local $string (call $string_new (i32.const 1)))
		(call $string_set_char (get_local $string) (i32.const 0) (get_local $char_code))
		(get_local $string)
	)
		
	(func $test_list_iterate_each (param $item i32) (param $index i32)
		
		(call $print_string (call $item_value (get_local $item)))
	)
	
	(func $test_map
		
		(local $map i32)
		(local $item i32)
		(call $print_string (i32.const 50))
		(call $print_string (i32.const 850))
		(call $print_string (i32.const 50))
	)

	(func $test_arguments_dynamic
		
		(call $print_string (i32.const 50))
	)

	(export "main" (func $main))
)
