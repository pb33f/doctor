// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"
)

const maxSpecMarkerScanLine = 1024 * 1024

// DetectSpecIdentity returns the source kind and root specification version
// without building a full OpenAPI or AsyncAPI document model.
func DetectSpecIdentity(data []byte) (SpecIdentity, error) {
	trimmed := bytes.TrimLeft(data, " \t\r\n")
	if len(trimmed) == 0 {
		return SpecIdentity{}, ErrUnknownSpecKind
	}
	if bytes.HasPrefix(trimmed, []byte{0xEF, 0xBB, 0xBF}) {
		trimmed = trimmed[3:]
	}
	if len(trimmed) > 0 && trimmed[0] == '{' {
		return detectJSONSpecIdentity(trimmed)
	}
	return detectYAMLSpecIdentity(trimmed)
}

func detectJSONSpecIdentity(data []byte) (SpecIdentity, error) {
	dec := json.NewDecoder(bytes.NewReader(data))
	tok, err := dec.Token()
	if err != nil {
		return SpecIdentity{}, fmt.Errorf("%w: %v", ErrUnknownSpecKind, err)
	}
	delim, ok := tok.(json.Delim)
	if !ok || delim != '{' {
		return SpecIdentity{}, ErrUnknownSpecKind
	}
	for dec.More() {
		keyTok, err := dec.Token()
		if err != nil {
			return SpecIdentity{}, fmt.Errorf("%w: %v", ErrUnknownSpecKind, err)
		}
		key, ok := keyTok.(string)
		if !ok {
			return SpecIdentity{}, ErrUnknownSpecKind
		}
		if isSpecMarkerKey(key) {
			var version any
			if err := dec.Decode(&version); err != nil {
				return SpecIdentity{}, fmt.Errorf("%w: %v", ErrUnknownSpecKind, err)
			}
			return classifySpecMarker(key, scalarMarkerValue(version))
		}
		if err := skipJSONValue(dec); err != nil {
			return SpecIdentity{}, fmt.Errorf("%w: %v", ErrUnknownSpecKind, err)
		}
	}
	return SpecIdentity{}, ErrUnknownSpecKind
}

func skipJSONValue(dec *json.Decoder) error {
	tok, err := dec.Token()
	if err != nil {
		return err
	}
	delim, ok := tok.(json.Delim)
	if !ok {
		return nil
	}
	switch delim {
	case '{':
		for dec.More() {
			if _, err := dec.Token(); err != nil {
				return err
			}
			if err := skipJSONValue(dec); err != nil {
				return err
			}
		}
		_, err = dec.Token()
		return err
	case '[':
		for dec.More() {
			if err := skipJSONValue(dec); err != nil {
				return err
			}
		}
		_, err = dec.Token()
		return err
	default:
		return nil
	}
}

func detectYAMLSpecIdentity(data []byte) (SpecIdentity, error) {
	scanner := bufio.NewScanner(bytes.NewReader(data))
	scanner.Buffer(make([]byte, 0, 4096), maxSpecMarkerScanLine)
	firstLine := true
	for scanner.Scan() {
		line := scanner.Text()
		if firstLine {
			line = strings.TrimPrefix(line, "\ufeff")
			firstLine = false
		}
		key, value, ok := topLevelYAMLScalar(line)
		if !ok {
			continue
		}
		if isSpecMarkerKey(key) {
			return classifySpecMarker(key, value)
		}
	}
	if err := scanner.Err(); err != nil {
		if !errors.Is(err, io.EOF) {
			return SpecIdentity{}, fmt.Errorf("%w: %v", ErrUnknownSpecKind, err)
		}
	}
	return SpecIdentity{}, ErrUnknownSpecKind
}

func topLevelYAMLScalar(line string) (string, string, bool) {
	if strings.TrimSpace(line) == "" {
		return "", "", false
	}
	trimmedLeft := strings.TrimLeftFunc(line, unicode.IsSpace)
	if trimmedLeft != line {
		return "", "", false
	}
	trimmed := strings.TrimSpace(line)
	if strings.HasPrefix(trimmed, "#") || strings.HasPrefix(trimmed, "---") || strings.HasPrefix(trimmed, "...") || strings.HasPrefix(trimmed, "%") {
		return "", "", false
	}
	colon := yamlKeyColon(trimmed)
	if colon < 0 {
		return "", "", false
	}
	key := unquoteYAMLScalar(strings.TrimSpace(trimmed[:colon]))
	if key == "" {
		return "", "", false
	}
	value := stripYAMLInlineComment(strings.TrimSpace(trimmed[colon+1:]))
	return key, unquoteYAMLScalar(value), true
}

func yamlKeyColon(line string) int {
	var quote rune
	escaped := false
	for i, r := range line {
		if quote != 0 {
			if quote == '"' && r == '\\' && !escaped {
				escaped = true
				continue
			}
			if r == quote && !escaped {
				quote = 0
			}
			escaped = false
			continue
		}
		if r == '"' || r == '\'' {
			quote = r
			continue
		}
		if r == ':' {
			return i
		}
	}
	return -1
}

func stripYAMLInlineComment(value string) string {
	if value == "" {
		return value
	}
	if first, width := utf8.DecodeRuneInString(value); first == '"' || first == '\'' {
		escaped := false
		for i, r := range value[width:] {
			pos := width + i
			if first == '"' && r == '\\' && !escaped {
				escaped = true
				continue
			}
			if r == first && !escaped {
				return strings.TrimSpace(value[:pos+width])
			}
			escaped = false
		}
		return value
	}
	for i, r := range value {
		if r != '#' {
			continue
		}
		if i == 0 || unicode.IsSpace(rune(value[i-1])) {
			return strings.TrimSpace(value[:i])
		}
	}
	return value
}

func unquoteYAMLScalar(value string) string {
	value = strings.TrimSpace(value)
	if len(value) < 2 {
		return value
	}
	switch {
	case value[0] == '"' && value[len(value)-1] == '"':
		unquoted, err := strconv.Unquote(value)
		if err == nil {
			return unquoted
		}
	case value[0] == '\'' && value[len(value)-1] == '\'':
		return strings.ReplaceAll(value[1:len(value)-1], "''", "'")
	}
	return value
}

func isSpecMarkerKey(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "asyncapi", "openapi", "swagger":
		return true
	default:
		return false
	}
}

func classifySpecMarker(key, version string) (SpecIdentity, error) {
	version = strings.TrimSpace(version)
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "asyncapi":
		if isAsyncAPI2Version(version) {
			return SpecIdentity{Kind: SpecKindAsyncAPI, Version: version}, ErrUnsupportedAsyncAPI2
		}
		return SpecIdentity{Kind: SpecKindAsyncAPI, Version: version}, nil
	case "openapi", "swagger":
		return SpecIdentity{Kind: SpecKindOpenAPI, Version: version}, nil
	default:
		return SpecIdentity{}, ErrUnknownSpecKind
	}
}

func scalarMarkerValue(value any) string {
	switch v := value.(type) {
	case string:
		return v
	case float64:
		return strconv.FormatFloat(v, 'f', -1, 64)
	case json.Number:
		return v.String()
	default:
		return ""
	}
}

func isAsyncAPI2Version(version string) bool {
	version = strings.TrimSpace(version)
	if version == "" {
		return false
	}
	major, _, _ := strings.Cut(version, ".")
	return major == "2"
}
