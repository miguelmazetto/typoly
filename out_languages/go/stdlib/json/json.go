// Package typoly_json provides TypeScript-compatible JSON functions for Go
package typoly_json

import (
	"encoding/json"
)

// Parse parses a JSON string
func Parse(str string) (interface{}, error) {
	var result interface{}
	err := json.Unmarshal([]byte(str), &result)
	return result, err
}

// Stringify converts a value to JSON string
func Stringify(value interface{}) (string, error) {
	bytes, err := json.Marshal(value)
	return string(bytes), err
}

// StringifyIndent converts a value to indented JSON string
func StringifyIndent(value interface{}, indent string) (string, error) {
	bytes, err := json.MarshalIndent(value, "", indent)
	return string(bytes), err
}
