// Package typoly_math provides TypeScript-compatible Math functions for Go
package typoly_math

import (
	"math"
	"math/rand"
	"time"
)

var random = rand.New(rand.NewSource(time.Now().UnixNano()))

// Constants matching TypeScript Math
const (
	E      = math.E
	LN2    = math.Ln2
	LN10   = math.Ln10
	LOG2E  = math.Log2E
	LOG10E = math.Log10E
	PI     = math.Pi
	SQRT2  = math.Sqrt2
)

// SQRT1_2 is sqrt(1/2) - not a compile-time constant
var SQRT1_2 = math.Sqrt(0.5)

// Abs returns the absolute value
func Abs(x float64) float64 {
	return math.Abs(x)
}

// Floor returns the largest integer less than or equal to x
func Floor(x float64) float64 {
	return math.Floor(x)
}

// Ceil returns the smallest integer greater than or equal to x
func Ceil(x float64) float64 {
	return math.Ceil(x)
}

// Round returns the nearest integer
func Round(x float64) float64 {
	return math.Round(x)
}

// Trunc returns the integer part of x
func Trunc(x float64) float64 {
	return math.Trunc(x)
}

// Fround returns the nearest 32-bit float
func Fround(x float64) float64 {
	return float64(float32(x))
}

// Min returns the minimum value
func Min(args ...float64) float64 {
	if len(args) == 0 {
		return math.NaN()
	}
	min := args[0]
	for _, v := range args[1:] {
		if v < min {
			min = v
		}
	}
	return min
}

// Max returns the maximum value
func Max(args ...float64) float64 {
	if len(args) == 0 {
		return math.NaN()
	}
	max := args[0]
	for _, v := range args[1:] {
		if v > max {
			max = v
		}
	}
	return max
}

// Pow returns base raised to exp
func Pow(base, exp float64) float64 {
	return math.Pow(base, exp)
}

// Sqrt returns the square root
func Sqrt(x float64) float64 {
	return math.Sqrt(x)
}

// Cbrt returns the cube root
func Cbrt(x float64) float64 {
	return math.Cbrt(x)
}

// Exp returns e raised to x
func Exp(x float64) float64 {
	return math.Exp(x)
}

// Expm1 returns e^x - 1
func Expm1(x float64) float64 {
	return math.Expm1(x)
}

// Log returns the natural logarithm
func Log(x float64) float64 {
	return math.Log(x)
}

// Log2 returns the base-2 logarithm
func Log2(x float64) float64 {
	return math.Log2(x)
}

// Log10 returns the base-10 logarithm
func Log10(x float64) float64 {
	return math.Log10(x)
}

// Log1p returns ln(1 + x)
func Log1p(x float64) float64 {
	return math.Log1p(x)
}

// Sin returns the sine
func Sin(x float64) float64 {
	return math.Sin(x)
}

// Cos returns the cosine
func Cos(x float64) float64 {
	return math.Cos(x)
}

// Tan returns the tangent
func Tan(x float64) float64 {
	return math.Tan(x)
}

// Asin returns the arcsine
func Asin(x float64) float64 {
	return math.Asin(x)
}

// Acos returns the arccosine
func Acos(x float64) float64 {
	return math.Acos(x)
}

// Atan returns the arctangent
func Atan(x float64) float64 {
	return math.Atan(x)
}

// Atan2 returns atan(y/x)
func Atan2(y, x float64) float64 {
	return math.Atan2(y, x)
}

// Sinh returns the hyperbolic sine
func Sinh(x float64) float64 {
	return math.Sinh(x)
}

// Cosh returns the hyperbolic cosine
func Cosh(x float64) float64 {
	return math.Cosh(x)
}

// Tanh returns the hyperbolic tangent
func Tanh(x float64) float64 {
	return math.Tanh(x)
}

// Asinh returns the inverse hyperbolic sine
func Asinh(x float64) float64 {
	return math.Asinh(x)
}

// Acosh returns the inverse hyperbolic cosine
func Acosh(x float64) float64 {
	return math.Acosh(x)
}

// Atanh returns the inverse hyperbolic tangent
func Atanh(x float64) float64 {
	return math.Atanh(x)
}

// Sign returns -1, 0, or 1
func Sign(x float64) float64 {
	if x > 0 {
		return 1
	}
	if x < 0 {
		return -1
	}
	return 0
}

// Hypot returns sqrt(x*x + y*y)
func Hypot(x, y float64) float64 {
	return math.Hypot(x, y)
}

// Random returns a random number [0, 1)
func Random() float64 {
	return random.Float64()
}

// Clamp clamps x between min and max
func Clamp(x, min, max float64) float64 {
	if x < min {
		return min
	}
	if x > max {
		return max
	}
	return x
}

// Lerp performs linear interpolation
func Lerp(a, b, t float64) float64 {
	return a + t*(b-a)
}

// IsFinite checks if x is finite
func IsFinite(x float64) bool {
	return !math.IsInf(x, 0) && !math.IsNaN(x)
}

// IsNaN checks if x is NaN
func IsNaN(x float64) bool {
	return math.IsNaN(x)
}

// IsInfinite checks if x is infinite
func IsInfinite(x float64) bool {
	return math.IsInf(x, 0)
}
