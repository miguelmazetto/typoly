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
