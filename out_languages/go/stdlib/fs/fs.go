// Package fs provides TypeScript-compatible file system operations
package fs

import (
	"io"
	"os"
	"path/filepath"
	"strings"
)

// WriteFileSync writes data to a file synchronously
func WriteFileSync(path string, data string) {
	os.WriteFile(path, []byte(data), 0644)
}

// ReadFileSync reads a file synchronously
func ReadFileSync(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	return string(data)
}

// ExistsSync checks if a file or directory exists
func ExistsSync(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

// AppendFileSync appends data to a file synchronously
func AppendFileSync(path string, data string) {
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return
	}
	defer f.Close()
	f.WriteString(data)
}

// MkdirSync creates a directory synchronously
func MkdirSync(path string) {
	os.MkdirAll(path, 0755)
}

// RmSync removes a file or directory synchronously
func RmSync(path string) {
	os.RemoveAll(path)
}

// RenameSync renames a file or directory
func RenameSync(oldPath string, newPath string) {
	os.Rename(oldPath, newPath)
}

// CopyFileSync copies a file synchronously
func CopyFileSync(src string, dest string) {
	data, err := os.ReadFile(src)
	if err != nil {
		return
	}
	os.WriteFile(dest, data, 0644)
}

// Basename returns the last element of a path
func Basename(path string) string {
	return filepath.Base(path)
}

// Dirname returns the directory element of a path
func Dirname(path string) string {
	return filepath.Dir(path)
}

// Extname returns the extension of a path
func Extname(path string) string {
	ext := filepath.Ext(path)
	return ext
}

// Join joins path elements
func Join(elem ...string) string {
	return filepath.Join(elem...)
}

// IsAbsolute checks if a path is absolute
func IsAbsolute(path string) bool {
	return filepath.IsAbs(path)
}

// Resolve resolves a path to an absolute path
func Resolve(path string) string {
	abs, _ := filepath.Abs(path)
	return abs
}

// Normalize normalizes a path
func Normalize(path string) string {
	return filepath.Clean(path)
}

// Relative returns a relative path from base to target
func Relative(base string, target string) string {
	rel, _ := filepath.Rel(base, target)
	return rel
}

// Parse parses a path into its components
type ParsedPath struct {
	Root string
	Dir  string
	Base string
	Ext  string
	Name string
}

func Parse(path string) ParsedPath {
	return ParsedPath{
		Root: "",
		Dir:  filepath.Dir(path),
		Base: filepath.Base(path),
		Ext:  filepath.Ext(path),
		Name: strings.TrimSuffix(filepath.Base(path), filepath.Ext(path)),
	}
}

// Format formats a parsed path back to a string
func Format(parsed ParsedPath) string {
	return filepath.Join(parsed.Dir, parsed.Base)
}

// Separator is the OS-specific path separator
var Separator = string(os.PathSeparator)

// Delimiter is the OS-specific path list delimiter
var Delimiter = string(os.PathListSeparator)

// CreateReadStream creates a readable stream (simplified - returns file content)
func CreateReadStream(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	return string(data)
}

// CreateWriteStream creates a writable stream (simplified)
func CreateWriteStream(path string) *os.File {
	f, err := os.Create(path)
	if err != nil {
		return nil
	}
	return f
}

// WriteStream writes to a file stream
func WriteStream(f *os.File, data string) {
	if f != nil {
		f.WriteString(data)
	}
}

// CloseStream closes a file stream
func CloseStream(f *os.File) {
	if f != nil {
		f.Close()
	}
}

// StatSync gets file stats
type Stats struct {
	Size  int64
	IsDir bool
}

func StatSync(path string) Stats {
	info, err := os.Stat(path)
	if err != nil {
		return Stats{}
	}
	return Stats{
		Size:  info.Size(),
		IsDir: info.IsDir(),
	}
}

// LstatSync gets file stats without following symlinks
func LstatSync(path string) Stats {
	info, err := os.Lstat(path)
	if err != nil {
		return Stats{}
	}
	return Stats{
		Size:  info.Size(),
		IsDir: info.IsDir(),
	}
}

// ReadDirSync reads directory contents
func ReadDirSync(path string) []string {
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil
	}
	names := make([]string, len(entries))
	for i, e := range entries {
		names[i] = e.Name()
	}
	return names
}

// TruncateSync truncates a file
func TruncateSync(path string, length int64) {
	os.Truncate(path, length)
}

// UnlinkSync removes a file
func UnlinkSync(path string) {
	os.Remove(path)
}

// ChmodSync changes file permissions
func ChmodSync(path string, mode int) {
	os.Chmod(path, os.FileMode(mode))
}

// AccessSync checks file accessibility
func AccessSync(path string, mode int) bool {
	_, err := os.Stat(path)
	return err == nil
}

// RealpathSync resolves a path to its canonical form
func RealpathSync(path string) string {
	abs, _ := filepath.Abs(path)
	return abs
}

// CopyFile copies a file using io.Copy
func CopyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}
