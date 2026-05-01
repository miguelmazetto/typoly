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

import (
	"regexp"
)

// RegExp wraps Go's regexp.Regexp to provide TypeScript-compatible API
type RegExp struct {
	re         *regexp.Regexp
	Source     string
	Global     bool
	IgnoreCase bool
	Multiline  bool
	Sticky     bool
	Unicode    bool
	DotAll     bool
}

// NewRegExp creates a new RegExp from pattern and optional flags
func NewRegExp(pattern string, flags ...string) *RegExp {
	var re *regexp.Regexp
	source := pattern
	global := false
	ignoreCase := false
	multiline := false
	sticky := false
	unicode := false
	dotAll := false

	if len(flags) > 0 {
		flagStr := flags[0]
		for _, f := range flagStr {
			switch f {
			case 'g':
				global = true
			case 'i':
				ignoreCase = true
			case 'm':
				multiline = true
			case 'y':
				sticky = true
			case 'u':
				unicode = true
			case 's':
				dotAll = true
			}
		}
	}

	if ignoreCase {
		re = regexp.MustCompile("(?i)" + pattern)
	} else {
		re = regexp.MustCompile(pattern)
	}

	return &RegExp{
		re:         re,
		Source:     source,
		Global:     global,
		IgnoreCase: ignoreCase,
		Multiline:  multiline,
		Sticky:     sticky,
		Unicode:    unicode,
		DotAll:     dotAll,
	}
}

// MatchResult represents a regex match result
type MatchResult struct {
	Value  string
	Index  int
	Groups []string
}

// Test tests if the pattern matches the string
func (r *RegExp) Test(str string) bool {
	return r.re.MatchString(str)
}

// Exec executes the regex and returns the first match
func (r *RegExp) Exec(str string) *MatchResult {
	match := r.re.FindStringSubmatchIndex(str)
	if match == nil {
		return nil
	}

	result := &MatchResult{
		Value: str[match[0]:match[1]],
		Index: match[0],
	}

	// Extract groups
	for i := 2; i < len(match); i += 2 {
		if match[i] >= 0 {
			result.Groups = append(result.Groups, str[match[i]:match[i+1]])
		} else {
			result.Groups = append(result.Groups, "")
		}
	}

	return result
}

// MatchAll returns all matches
func (r *RegExp) MatchAll(str string) []MatchResult {
	matches := r.re.FindAllStringSubmatchIndex(str, -1)
	if matches == nil {
		return nil
	}

	results := make([]MatchResult, len(matches))
	for i, match := range matches {
		result := MatchResult{
			Value: str[match[0]:match[1]],
			Index: match[0],
		}

		for j := 2; j < len(match); j += 2 {
			if match[j] >= 0 {
				result.Groups = append(result.Groups, str[match[j]:match[j+1]])
			} else {
				result.Groups = append(result.Groups, "")
			}
		}

		results[i] = result
	}

	return results
}

// Replace replaces matches with the replacement string
func (r *RegExp) Replace(str string, replacement string) string {
	return r.re.ReplaceAllString(str, replacement)
}

// Split splits the string by the pattern
func (r *RegExp) Split(str string, limit ...int) []string {
	n := -1
	if len(limit) > 0 {
		n = limit[0]
	}
	return r.re.Split(str, n)
}

// Search returns the index of the first match
func (r *RegExp) Search(str string) int {
	loc := r.re.FindStringIndex(str)
	if loc == nil {
		return -1
	}
	return loc[0]
}
