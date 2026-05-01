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
// Package console provides TypeScript-compatible console functions for Go
package console

import (
	"fmt"
	"os"
)

// Log prints to stdout with newline
func Log(args ...interface{}) {
	fmt.Println(args...)
}

// Info prints to stdout with newline
func Info(args ...interface{}) {
	fmt.Println(args...)
}

// Warn prints to stderr with newline
func Warn(args ...interface{}) {
	fmt.Fprintln(os.Stderr, args...)
}

// Error prints to stderr with newline
func Error(args ...interface{}) {
	fmt.Fprintln(os.Stderr, args...)
}

// Debug prints to stdout with newline
func Debug(args ...interface{}) {
	fmt.Println(args...)
}

// Dir prints object properties
func Dir(obj interface{}) {
	fmt.Printf("%+v\n", obj)
}

// Table prints as table
func Table(data interface{}) {
	fmt.Printf("%+v\n", data)
}

// Trace prints stack trace
func Trace(args ...interface{}) {
	fmt.Println(args...)
}

// Assert panics if condition is false
func Assert(condition bool, message ...interface{}) {
	if !condition {
		if len(message) > 0 {
			panic(fmt.Sprintf("Assertion failed: %v", message))
		}
		panic("Assertion failed")
	}
}

// Clear clears the console (ANSI)
func Clear() {
	fmt.Print("\033[2J\033[1;1H")
}
