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
// Package typoly provides TypeScript-compatible types for Go
package typoly

import (
	"fmt"
	"strings"
	"sync"
)

// String represents a TypeScript-compatible string type
type String struct {
	value string
}

// NewString creates a new String from a Go string
func NewString(s string) String {
	return String{value: s}
}

// Length returns the length of the string
func (s String) Length() int {
	return len(s.value)
}

// CharAt returns the character at the given index
func (s String) CharAt(index int) String {
	if index < 0 || index >= len(s.value) {
		return String{""}
	}
	return String{string(s.value[index])}
}

// CharCodeAt returns the character code at the given index
func (s String) CharCodeAt(index int) int {
	if index < 0 || index >= len(s.value) {
		return -1
	}
	return int(s.value[index])
}

// Concat concatenates strings
func (s String) Concat(other String) String {
	return String{s.value + other.value}
}

// Includes checks if the string contains the search string
func (s String) Includes(search string, start int) bool {
	if start > len(s.value) {
		return false
	}
	return strings.Contains(s.value[start:], search)
}

// EndsWith checks if the string ends with the search string
func (s String) EndsWith(search string, length int) bool {
	if length <= 0 || length > len(s.value) {
		length = len(s.value)
	}
	if len(search) > length {
		return false
	}
	return strings.HasSuffix(s.value[:length], search)
}

// IndexOf returns the index of the first occurrence
func (s String) IndexOf(search string, start int) int {
	if start >= len(s.value) {
		return -1
	}
	idx := strings.Index(s.value[start:], search)
	if idx == -1 {
		return -1
	}
	return start + idx
}

// LastIndexOf returns the index of the last occurrence
func (s String) LastIndexOf(search string) int {
	return strings.LastIndex(s.value, search)
}

// PadEnd pads the string at the end
func (s String) PadEnd(targetLength int, padString String) String {
	if s.Length() >= targetLength {
		return s
	}
	pad := padString.value
	if len(pad) == 0 {
		pad = " "
	}
	result := s.value
	for len(result) < targetLength {
		needed := targetLength - len(result)
		if needed >= len(pad) {
			result += pad
		} else {
			result += pad[:needed]
		}
	}
	return String{result}
}

// PadStart pads the string at the start
func (s String) PadStart(targetLength int, padString String) String {
	if s.Length() >= targetLength {
		return s
	}
	pad := padString.value
	if len(pad) == 0 {
		pad = " "
	}
	result := ""
	for len(result)+s.Length() < targetLength {
		needed := targetLength - len(result) - s.Length()
		if needed >= len(pad) {
			result = pad + result
		} else {
			result = pad[:needed] + result
		}
	}
	return String{result + s.value}
}

// Repeat repeats the string
func (s String) Repeat(count int) String {
	return String{strings.Repeat(s.value, count)}
}

// Replace replaces the first occurrence
func (s String) Replace(search string, replace string) String {
	return String{strings.Replace(s.value, search, replace, 1)}
}

// ReplaceAll replaces all occurrences
func (s String) ReplaceAll(search string, replace string) String {
	return String{strings.ReplaceAll(s.value, search, replace)}
}

// Split splits the string by separator
func (s String) Split(separator string, limit int) []String {
	if limit <= 0 {
		limit = -1
	}
	parts := strings.SplitN(s.value, separator, limit)
	result := make([]String, len(parts))
	for i, p := range parts {
		result[i] = String{p}
	}
	return result
}

// StartsWith checks if the string starts with the search string
func (s String) StartsWith(search string, start int) bool {
	if start > len(s.value) {
		return false
	}
	return strings.HasPrefix(s.value[start:], search)
}

// Substring returns a substring
func (s String) Substring(start, end int) String {
	if start < 0 {
		start = 0
	}
	if end <= 0 || end > len(s.value) {
		end = len(s.value)
	}
	if start >= end {
		return String{""}
	}
	return String{s.value[start:end]}
}

// Slice returns a slice of the string (supports negative indices)
func (s String) Slice(start, end int) String {
	length := len(s.value)
	if start < 0 {
		start = length + start
	}
	if end < 0 {
		end = length + end
	}
	if start < 0 {
		start = 0
	}
	if end > length {
		end = length
	}
	if start >= end {
		return String{""}
	}
	return String{s.value[start:end]}
}

// ToLowerCase converts to lowercase
func (s String) ToLowerCase() String {
	return String{strings.ToLower(s.value)}
}

// ToUpperCase converts to uppercase
func (s String) ToUpperCase() String {
	return String{strings.ToUpper(s.value)}
}

// Trim removes whitespace from both ends
func (s String) Trim() String {
	return String{strings.TrimSpace(s.value)}
}

// TrimStart removes whitespace from the start
func (s String) TrimStart() String {
	return String{strings.TrimLeft(s.value, " \t\n\r\f\v")}
}

// TrimEnd removes whitespace from the end
func (s String) TrimEnd() String {
	return String{strings.TrimRight(s.value, " \t\n\r\f\v")}
}

// ToString returns the Go string value
func (s String) ToString() string {
	return s.value
}

// Value implements fmt.Stringer
func (s String) String() string {
	return s.value
}

// Equals checks equality
func (s String) Equals(other String) bool {
	return s.value == other.value
}

// Vector represents a TypeScript-compatible array type
type Vector[T any] struct {
	vec []T
	mu  sync.RWMutex
}

// NewVector creates a new Vector
func NewVector[T any]() *Vector[T] {
	return &Vector[T]{vec: make([]T, 0)}
}

// NewVectorWith creates a new Vector with initial values
func NewVectorWith[T any](items ...T) *Vector[T] {
	return &Vector[T]{vec: items}
}

// Length returns the length
func (v *Vector[T]) Length() int {
	v.mu.RLock()
	defer v.mu.RUnlock()
	return len(v.vec)
}

// Size returns the length (alias)
func (v *Vector[T]) Size() int {
	return v.Length()
}

// Get returns the element at index
func (v *Vector[T]) Get(index int) T {
	v.mu.RLock()
	defer v.mu.RUnlock()
	return v.vec[index]
}

// Set sets the element at index
func (v *Vector[T]) Set(index int, value T) {
	v.mu.Lock()
	defer v.mu.Unlock()
	v.vec[index] = value
}

// Push adds an element to the end
func (v *Vector[T]) Push(item T) {
	v.mu.Lock()
	defer v.mu.Unlock()
	v.vec = append(v.vec, item)
}

// Pop removes and returns the last element
func (v *Vector[T]) Pop() T {
	v.mu.Lock()
	defer v.mu.Unlock()
	item := v.vec[len(v.vec)-1]
	v.vec = v.vec[:len(v.vec)-1]
	return item
}

// Shift removes and returns the first element
func (v *Vector[T]) Shift() T {
	v.mu.Lock()
	defer v.mu.Unlock()
	item := v.vec[0]
	v.vec = v.vec[1:]
	return item
}

// Unshift adds an element to the beginning
func (v *Vector[T]) Unshift(item T) {
	v.mu.Lock()
	defer v.mu.Unlock()
	v.vec = append([]T{item}, v.vec...)
}

// Splice removes elements and optionally adds new ones
func (v *Vector[T]) Splice(start, deleteCount int, items ...T) []T {
	v.mu.Lock()
	defer v.mu.Unlock()
	if start < 0 {
		start = len(v.vec) + start
	}
	if start < 0 {
		start = 0
	}
	if deleteCount < 0 {
		deleteCount = 0
	}
	if start+deleteCount > len(v.vec) {
		deleteCount = len(v.vec) - start
	}
	deleted := make([]T, deleteCount)
	copy(deleted, v.vec[start:start+deleteCount])
	v.vec = append(v.vec[:start], append(items, v.vec[start+deleteCount:]...)...)
	return deleted
}

// Slice returns a shallow copy
func (v *Vector[T]) Slice(start, end int) *Vector[T] {
	v.mu.RLock()
	defer v.mu.RUnlock()
	if start < 0 {
		start = len(v.vec) + start
	}
	if end <= 0 {
		end = len(v.vec) + end
	}
	if start < 0 {
		start = 0
	}
	if end > len(v.vec) {
		end = len(v.vec)
	}
	if start >= end {
		return NewVector[T]()
	}
	newVec := make([]T, end-start)
	copy(newVec, v.vec[start:end])
	return &Vector[T]{vec: newVec}
}

// Includes checks if the element exists
func (v *Vector[T]) Includes(item T, equals func(T, T) bool) bool {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for _, val := range v.vec {
		if equals(val, item) {
			return true
		}
	}
	return false
}

// IndexOf returns the index of the element
func (v *Vector[T]) IndexOf(item T, equals func(T, T) bool) int {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, val := range v.vec {
		if equals(val, item) {
			return i
		}
	}
	return -1
}

// LastIndexOf returns the last index of the element
func (v *Vector[T]) LastIndexOf(item T, equals func(T, T) bool) int {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i := len(v.vec) - 1; i >= 0; i-- {
		if equals(v.vec[i], item) {
			return i
		}
	}
	return -1
}

// ForEach iterates over elements
func (v *Vector[T]) ForEach(fn func(T, int, *Vector[T])) {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, item := range v.vec {
		fn(item, i, v)
	}
}

// Map transforms elements
func (v *Vector[T]) Map(fn func(T, int) T) *Vector[T] {
	v.mu.RLock()
	defer v.mu.RUnlock()
	newVec := make([]T, len(v.vec))
	for i, item := range v.vec {
		newVec[i] = fn(item, i)
	}
	return &Vector[T]{vec: newVec}
}

// Filter filters elements
func (v *Vector[T]) Filter(fn func(T, int) bool) *Vector[T] {
	v.mu.RLock()
	defer v.mu.RUnlock()
	newVec := make([]T, 0)
	for i, item := range v.vec {
		if fn(item, i) {
			newVec = append(newVec, item)
		}
	}
	return &Vector[T]{vec: newVec}
}

// Reduce reduces elements to a single value
func (v *Vector[T]) Reduce(fn func(T, T, int) T, initial T) T {
	v.mu.RLock()
	defer v.mu.RUnlock()
	result := initial
	for i, item := range v.vec {
		result = fn(result, item, i)
	}
	return result
}

// Find finds an element
func (v *Vector[T]) Find(fn func(T, int) bool) (T, bool) {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, item := range v.vec {
		if fn(item, i) {
			return item, true
		}
	}
	var zero T
	return zero, false
}

// FindIndex finds the index of an element
func (v *Vector[T]) FindIndex(fn func(T, int) bool) int {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, item := range v.vec {
		if fn(item, i) {
			return i
		}
	}
	return -1
}

// Some checks if any element matches
func (v *Vector[T]) Some(fn func(T, int) bool) bool {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, item := range v.vec {
		if fn(item, i) {
			return true
		}
	}
	return false
}

// Every checks if all elements match
func (v *Vector[T]) Every(fn func(T, int) bool) bool {
	v.mu.RLock()
	defer v.mu.RUnlock()
	for i, item := range v.vec {
		if !fn(item, i) {
			return false
		}
	}
	return true
}

// Reverse reverses the vector in place
func (v *Vector[T]) Reverse() *Vector[T] {
	v.mu.Lock()
	defer v.mu.Unlock()
	for i, j := 0, len(v.vec)-1; i < j; i, j = i+1, j-1 {
		v.vec[i], v.vec[j] = v.vec[j], v.vec[i]
	}
	return v
}

// Sort sorts the vector
func (v *Vector[T]) Sort(less func(T, T) bool) *Vector[T] {
	v.mu.Lock()
	defer v.mu.Unlock()
	// Simple bubble sort for demonstration
	n := len(v.vec)
	for i := 0; i < n-1; i++ {
		for j := 0; j < n-i-1; j++ {
			if !less(v.vec[j], v.vec[j+1]) {
				v.vec[j], v.vec[j+1] = v.vec[j+1], v.vec[j]
			}
		}
	}
	return v
}

// Join joins elements with separator
func (v *Vector[T]) Join(sep string, toString func(T) string) string {
	v.mu.RLock()
	defer v.mu.RUnlock()
	strs := make([]string, len(v.vec))
	for i, item := range v.vec {
		strs[i] = toString(item)
	}
	return strings.Join(strs, sep)
}

// ToSlice returns the underlying slice
func (v *Vector[T]) ToSlice() []T {
	v.mu.RLock()
	defer v.mu.RUnlock()
	result := make([]T, len(v.vec))
	copy(result, v.vec)
	return result
}

// Map represents a TypeScript-compatible map type
type Map[K comparable, V any] struct {
	data map[K]V
	mu   sync.RWMutex
}

// NewMap creates a new Map
func NewMap[K comparable, V any]() *Map[K, V] {
	return &Map[K, V]{data: make(map[K]V)}
}

// Get returns the value for key
func (m *Map[K, V]) Get(key K) (V, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	val, ok := m.data[key]
	return val, ok
}

// Set sets the value for key
func (m *Map[K, V]) Set(key K, value V) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[key] = value
}

// Has checks if key exists
func (m *Map[K, V]) Has(key K) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	_, ok := m.data[key]
	return ok
}

// Delete removes a key
func (m *Map[K, V]) Delete(key K) bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	_, ok := m.data[key]
	if ok {
		delete(m.data, key)
	}
	return ok
}

// Clear removes all entries
func (m *Map[K, V]) Clear() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data = make(map[K]V)
}

// Size returns the number of entries
func (m *Map[K, V]) Size() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.data)
}

// Keys returns all keys
func (m *Map[K, V]) Keys() []K {
	m.mu.RLock()
	defer m.mu.RUnlock()
	keys := make([]K, 0, len(m.data))
	for k := range m.data {
		keys = append(keys, k)
	}
	return keys
}

// Values returns all values
func (m *Map[K, V]) Values() []V {
	m.mu.RLock()
	defer m.mu.RUnlock()
	values := make([]V, 0, len(m.data))
	for _, v := range m.data {
		values = append(values, v)
	}
	return values
}

// ForEach iterates over entries
func (m *Map[K, V]) ForEach(fn func(V, K, *Map[K, V])) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for k, v := range m.data {
		fn(v, k, m)
	}
}

// Set represents a TypeScript-compatible set type
type Set[T comparable] struct {
	data map[T]struct{}
	mu   sync.RWMutex
}

// NewSet creates a new Set
func NewSet[T comparable]() *Set[T] {
	return &Set[T]{data: make(map[T]struct{})}
}

// Add adds an element
func (s *Set[T]) Add(item T) *Set[T] {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[item] = struct{}{}
	return s
}

// Has checks if element exists
func (s *Set[T]) Has(item T) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, ok := s.data[item]
	return ok
}

// Delete removes an element
func (s *Set[T]) Delete(item T) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.data[item]
	if ok {
		delete(s.data, item)
	}
	return ok
}

// Clear removes all elements
func (s *Set[T]) Clear() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data = make(map[T]struct{})
}

// Size returns the number of elements
func (s *Set[T]) Size() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

// Values returns all values
func (s *Set[T]) Values() []T {
	s.mu.RLock()
	defer s.mu.RUnlock()
	values := make([]T, 0, len(s.data))
	for v := range s.data {
		values = append(values, v)
	}
	return values
}

// ForEach iterates over elements
func (s *Set[T]) ForEach(fn func(T, T, *Set[T])) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for v := range s.data {
		fn(v, v, s)
	}
}

// Value represents a universal type (like TypeScript any)
type Value struct {
	data interface{}
}

// NewValue creates a new Value
func NewValue(data interface{}) Value {
	return Value{data: data}
}

// As returns the value as type T
func (v Value) As() interface{} {
	return v.data
}

// IsNull checks if value is nil
func (v Value) IsNull() bool {
	return v.data == nil
}

// HasValue checks if value is not nil
func (v Value) HasValue() bool {
	return v.data != nil
}

// String returns string representation
func (v Value) String() string {
	if v.data == nil {
		return "undefined"
	}
	return fmt.Sprintf("%v", v.data)
}
