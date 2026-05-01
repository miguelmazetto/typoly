/* Copyright 2026 Miguel Ferreira Mazetto
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
 */
package typoly

import "fmt"

// Union represents a TypeScript union type in Go
// It can hold any value and provides type checking and conversion
type Union struct {
	value interface{}
}

// NewUnion creates a new Union with the given value
func NewUnion(value interface{}) *Union {
	return &Union{value: value}
}

// Set sets the union value
func (u *Union) Set(value interface{}) {
	u.value = value
}

// Is checks if the current value is of the specified type
func (u *Union) Is(typeName string) bool {
	if u.value == nil {
		return false
	}
	switch typeName {
	case "string":
		_, ok := u.value.(string)
		return ok
	case "number":
		_, ok := u.value.(float64)
		return ok
	case "boolean":
		_, ok := u.value.(bool)
		return ok
	case "object":
		return u.value != nil && !isPrimitive(u.value)
	default:
		return false
	}
}

// String returns the value as string
func (u *Union) String() string {
	if v, ok := u.value.(string); ok {
		return v
	}
	return fmt.Sprintf("%v", u.value)
}

// Number returns the value as float64
func (u *Union) Number() float64 {
	if v, ok := u.value.(float64); ok {
		return v
	}
	return 0
}

// Bool returns the value as bool
func (u *Union) Bool() bool {
	if v, ok := u.value.(bool); ok {
		return v
	}
	return false
}

// Value returns the underlying value
func (u *Union) Value() interface{} {
	return u.value
}

// Helper function to check if a value is a primitive type
func isPrimitive(v interface{}) bool {
	switch v.(type) {
	case string, float64, bool, int, int64, uint64:
		return true
	default:
		return false
	}
}
