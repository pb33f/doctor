// Copyright 2023-2025 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io

package helpers

import (
	"fmt"
	"github.com/cespare/xxhash/v2"
	"github.com/santhosh-tekuri/jsonschema/v6"
	"github.com/santhosh-tekuri/jsonschema/v6/kind"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
	"strings"
	"sync"
)

var stringPool sync.Map

// DiveIntoValidationError recursively dives into the validation error and collects all the causes, nicely
// printed and formatted in a string slice
func DiveIntoValidationError(e *jsonschema.ValidationError, causes *[]string, location string) {
	if e.Causes != nil && len(e.Causes) > 0 {
		for _, cause := range e.Causes {
			DiveIntoValidationError(cause, causes, location)
		}
	}

	if strings.Join(e.InstanceLocation, "/") != location {
		return
	}

	defaultPrinter := message.NewPrinter(language.English)
	msg := e.ErrorKind.LocalizedString(defaultPrinter)

	switch k := e.ErrorKind.(type) {
	case *kind.InvalidJsonValue:
		msg = fmt.Sprintf("`%s` is not valid JSON `%T`: `%v`",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Value, k.Value)

	case *kind.Schema:
		msg = fmt.Sprintf("schema validation failed at: `%s`", k.Location)

	case *kind.Group:
		return

	case *kind.Not:
		return

	case *kind.AllOf:
		return

	case *kind.AnyOf:
		return

	case *kind.OneOf:
		return

	case *kind.FalseSchema:
		// TODO: handle a false‐schema

	case *kind.RefCycle:
		return

	case *kind.Type:
		want := strings.Join(k.Want, " or ")
		msg = fmt.Sprintf("type mismatch: got `%s`, but want `%s`", k.Got, want)

	case *kind.Enum:
		if len(k.Want) == 1 {
			msg = fmt.Sprintf("`%s` is invalid for property `%s`, value must be `%v`",
				k.Got, e.InstanceLocation[len(e.InstanceLocation)-1], k.Want[0])
		} else {
			msg = fmt.Sprintf("`%s` is invalid for property `%s`, value must be one of %v",
				k.Got, e.InstanceLocation[len(e.InstanceLocation)-1], WrapBackticks(k.Want))
		}

	case *kind.Const:
		msg = fmt.Sprintf("value must be `%v`", k.Want)

	case *kind.Format:
		msg = fmt.Sprintf("invalid format: got `%s`, but want `%s`", k.Got, k.Want)

	case *kind.Reference:
		return

	case *kind.MinProperties:
		msg = fmt.Sprintf("`%s` must have at least `%d` properties (I only found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.MaxProperties:
		msg = fmt.Sprintf("`%s` must have at most `%d` properties (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.MinItems:
		msg = fmt.Sprintf("`%s` must have at most `%d` items  (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.MaxItems:
		msg = fmt.Sprintf("`%s` must have at most `%d` items (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.AdditionalItems:
		msg = fmt.Sprintf("`%s` is not allowed any additional items (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Count)

	case *kind.Required:
		if len(k.Missing) == 1 {
			msg = fmt.Sprintf("missing a required property: %s", WrapBackticksString([]string{k.Missing[0]}))
		} else {
			msg = fmt.Sprintf("missing required properties %s", WrapBackticksString(k.Missing))
		}

	case *kind.Dependency:
		msg = fmt.Sprintf("`%s` requires `%s` to be present, but it is not",
			k.Prop, WrapBackticksString(k.Missing))

	case *kind.DependentRequired:
		msg = fmt.Sprintf("`%s` requires `%s` to be present, but it is not",
			k.Prop, WrapBackticksString(k.Missing))

	case *kind.AdditionalProperties:
		msg = fmt.Sprintf("`%s` is not allowed any additional properties (I found %s)",
			e.InstanceLocation[len(e.InstanceLocation)-1], WrapBackticksString(k.Properties))

	case *kind.PropertyNames:
		msg = fmt.Sprintf("`%s` is an invalid property name", k.Property)

	case *kind.UniqueItems:
		msg = fmt.Sprintf("duplicate items found at positions `%d` and `%dd`", k.Duplicates[0], k.Duplicates[1])

	case *kind.Contains:
		msg = fmt.Sprint("array must contain at least one item of type of matching schema")

	case *kind.MinContains:
		msg = fmt.Sprintf("`%s` must match at least `%d` items (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, len(k.Got))

	case *kind.MaxContains:
		msg = fmt.Sprintf("`%s` must match at most `%d` items (I found `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, len(k.Got))

	case *kind.MinLength:
		msg = fmt.Sprintf("`%s` must be at least `%d` characters long (I counted `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.MaxLength:
		msg = fmt.Sprintf("`%s` must be at most `%d` characters long (I counted `%d`)",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want, k.Got)

	case *kind.Pattern:
		msg = fmt.Sprintf("the value of `%s` (`%s`) does not match the required pattern `%s`",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Got, k.Want)

	case *kind.ContentEncoding:
		msg = fmt.Sprintf("`%s` must be correctly encoded with `%s`",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want)

	case *kind.ContentMediaType:
		msg = fmt.Sprintf("`%s` is not of the media type `%s`",
			e.InstanceLocation[len(e.InstanceLocation)-1], k.Want)

	case *kind.ContentSchema:
		msg = fmt.Sprint("does not conform to `contentSchema`")

	case *kind.Minimum:
		got, _ := k.Got.Float64()
		want, _ := k.Want.Float64()
		msg = fmt.Sprintf("`%s` has a value of `%f`, must be no less than `%f`",
			e.InstanceLocation[len(e.InstanceLocation)-1], got, want)

	case *kind.Maximum:
		got, _ := k.Got.Float64()
		want, _ := k.Want.Float64()
		msg = fmt.Sprintf("`%s` has a value of `%f`, must be no greater than `%f`",
			e.InstanceLocation[len(e.InstanceLocation)-1], got, want)

	case *kind.ExclusiveMinimum:
		got, _ := k.Got.Float64()
		want, _ := k.Want.Float64()
		msg = fmt.Sprintf("`%s` has a value of `%f`, must be no less than `%f`",
			e.InstanceLocation[len(e.InstanceLocation)-1], got, want)

	case *kind.ExclusiveMaximum:
		got, _ := k.Got.Float64()
		want, _ := k.Want.Float64()
		msg = fmt.Sprintf("`%s` has a value of `%f`, must be no greater than `%f`",
			e.InstanceLocation[len(e.InstanceLocation)-1], got, want)

	case *kind.MultipleOf:
		got, _ := k.Got.Float64()
		want, _ := k.Want.Float64()
		msg = fmt.Sprintf("`%s` has a value of `%f`, it must be a multiple of `%f`",
			e.InstanceLocation[len(e.InstanceLocation)-1], got, want)

	default:
		msg = "validation failed"
	}

	if strings.Contains(msg, "validation failed") {
		return
	}

	*causes = append(*causes, msg)
	return
}
func WrapBackticksString(s []string) string {
	var a []any
	for _, v := range s {
		a = append(a, v)
	}
	return WrapBackticks(a)
}

// WrapBackticks wraps each s in backticks and joins with ", ".
func WrapBackticks(slice []any) string {
	if len(slice) == 0 {
		return ""
	}
	var b strings.Builder
	est := 0
	for _, s := range slice {
		est += len(fmt.Sprint(s)) + 3
	}
	b.Grow(est)

	for i, s := range slice {
		if i > 0 {
			b.WriteString(", ")
		}
		b.WriteByte('`')
		b.WriteString(strings.ReplaceAll(fmt.Sprint(s), `"`, ""))
		b.WriteByte('`')
	}
	return b.String()
}

func HashString(s string) string {
	return Intern(fmt.Sprintf("%x", xxhash.Sum64String(s)))
}

func Intern(s string) string {
	if interned, exists := stringPool.Load(s); exists {
		return interned.(string)
	}
	stringPool.Store(s, s)
	return s
}
