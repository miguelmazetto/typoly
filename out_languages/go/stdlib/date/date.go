// Package typoly_date provides TypeScript-compatible Date functions for Go
package typoly_date

import (
	"time"
)

// Date represents a TypeScript-compatible Date
type Date struct {
	time.Time
}

// NewDate creates a new Date with current time
func NewDate() Date {
	return Date{time.Now()}
}

// NewDateFromTime creates a Date from time.Time
func NewDateFromTime(t time.Time) Date {
	return Date{t}
}

// NewDateFromTimestamp creates a Date from milliseconds since epoch
func NewDateFromTimestamp(ms int64) Date {
	return Date{time.Unix(0, ms*int64(time.Millisecond))}
}

// NewDateFromComponents creates a Date from components
func NewDateFromComponents(year, month, day, hour, min, sec, msec int) Date {
	t := time.Date(year, time.Month(month), day, hour, min, sec, msec*int(time.Millisecond), time.Local)
	return Date{t}
}

// Parse parses a date string
func Parse(layout, value string) (Date, error) {
	t, err := time.Parse(layout, value)
	return Date{t}, err
}

// GetFullYear returns the year
func (d Date) GetFullYear() int {
	return d.Year()
}

// GetMonth returns the month (0-11)
func (d Date) GetMonth() int {
	return int(d.Month()) - 1
}

// GetDate returns the day of month
func (d Date) GetDate() int {
	return d.Day()
}

// GetDay returns the day of week (0=Sunday)
func (d Date) GetDay() int {
	return int(d.Weekday())
}

// GetHours returns the hour
func (d Date) GetHours() int {
	return d.Hour()
}

// GetMinutes returns the minutes
func (d Date) GetMinutes() int {
	return d.Minute()
}

// GetSeconds returns the seconds
func (d Date) GetSeconds() int {
	return d.Second()
}

// GetMilliseconds returns the milliseconds
func (d Date) GetMilliseconds() int {
	return d.Nanosecond() / int(time.Millisecond)
}

// GetTime returns milliseconds since epoch
func (d Date) GetTime() int64 {
	return d.UnixNano() / int64(time.Millisecond)
}

// SetFullYear sets the year
func (d Date) SetFullYear(year int) Date {
	return Date{time.Date(year, d.Month(), d.Day(), d.Hour(), d.Minute(), d.Second(), d.Nanosecond(), d.Location())}
}

// SetMonth sets the month
func (d Date) SetMonth(month int) Date {
	return Date{time.Date(d.Year(), time.Month(month+1), d.Day(), d.Hour(), d.Minute(), d.Second(), d.Nanosecond(), d.Location())}
}

// SetDate sets the day of month
func (d Date) SetDate(day int) Date {
	return Date{time.Date(d.Year(), d.Month(), day, d.Hour(), d.Minute(), d.Second(), d.Nanosecond(), d.Location())}
}

// ToString returns string representation
func (d Date) ToString() string {
	return d.Format(time.RFC1123)
}

// ToISOString returns ISO 8601 format
func (d Date) ToISOString() string {
	return d.Format(time.RFC3339)
}

// ToDateString returns date portion
func (d Date) ToDateString() string {
	return d.Format("Mon Jan 02 2006")
}

// ToTimeString returns time portion
func (d Date) ToTimeString() string {
	return d.Format("15:04:05 GMT-0700")
}

// ToJSON returns JSON format (ISO)
func (d Date) ToJSON() string {
	return d.ToISOString()
}

// ValueOf returns milliseconds since epoch
func (d Date) ValueOf() int64 {
	return d.GetTime()
}
