// Copyright 2025 Princess B33f Heavy Industries / Dave Shanley
// SPDX-License-Identifier: BUSL-1.1

package github

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"
)

// LogLevel represents the severity level of log messages in the structured logging system.
// Supports standard log levels from debug to critical with hierarchical filtering.
type LogLevel int

const (
	LogLevelDebug LogLevel = iota
	LogLevelInfo
	LogLevelWarn
	LogLevelError
	LogLevelCritical
)

// String returns the standardized string representation of a log level.
// Used for consistent log formatting across different output destinations.
func (l LogLevel) String() string {
	switch l {
	case LogLevelDebug:
		return "DEBUG"
	case LogLevelInfo:
		return "INFO"
	case LogLevelWarn:
		return "WARN"
	case LogLevelError:
		return "ERROR"
	case LogLevelCritical:
		return "CRITICAL"
	default:
		return "UNKNOWN"
	}
}

// Logger defines the interface for structured logging with contextual information.
// Supports hierarchical log levels, structured fields, and contextual enrichment
// with session IDs, operation IDs, and request context for distributed tracing.
type Logger interface {
	Debug(msg string, fields ...LogField)
	Info(msg string, fields ...LogField)
	Warn(msg string, fields ...LogField)
	Error(msg string, fields ...LogField)
	Critical(msg string, fields ...LogField)
	WithContext(ctx context.Context) Logger
	WithSession(sessionID string) Logger
	WithOperation(operationID string) Logger
}

// LogField represents a key-value pair for structured logging.
// Enables rich contextual information in log entries for better observability
// and debugging in production environments.
type LogField struct {
	Key   string
	Value interface{}
}

// ProductionLogger is a production-ready structured logger implementation
// with configurable log levels, contextual enrichment, and timestamp support.
// Designed for high-performance logging in concurrent environments.
type ProductionLogger struct {
	level       LogLevel
	sessionID   string
	operationID string
	context     context.Context
	logger      *log.Logger
}

// NewProductionLogger creates a production-ready logger with the specified minimum log level.
// Uses Go's standard log package with microsecond timestamps for precise timing
// information in production environments.
func NewProductionLogger(level LogLevel) *ProductionLogger {
	return &ProductionLogger{
		level:  level,
		logger: log.New(os.Stdout, "", log.LstdFlags|log.Lmicroseconds),
	}
}

// Debug logs a debug-level message with optional structured fields.
// Only outputs if the logger's level is set to debug or lower.
// Useful for detailed troubleshooting and development information.
func (l *ProductionLogger) Debug(msg string, fields ...LogField) {
	if l.level <= LogLevelDebug {
		l.log(LogLevelDebug, msg, fields...)
	}
}

// Info logs an informational message with optional structured fields.
// Used for normal operational messages and important state changes
// that should be visible in production logs.
func (l *ProductionLogger) Info(msg string, fields ...LogField) {
	if l.level <= LogLevelInfo {
		l.log(LogLevelInfo, msg, fields...)
	}
}

// Warn logs a warning message with optional structured fields.
// Used for potentially problematic situations that don't prevent
// operation continuation but should be monitored.
func (l *ProductionLogger) Warn(msg string, fields ...LogField) {
	if l.level <= LogLevelWarn {
		l.log(LogLevelWarn, msg, fields...)
	}
}

// Error logs an error message with optional structured fields.
// Used for error conditions that affect operation but allow
// the application to continue running.
func (l *ProductionLogger) Error(msg string, fields ...LogField) {
	if l.level <= LogLevelError {
		l.log(LogLevelError, msg, fields...)
	}
}

// Critical logs a critical message with optional structured fields.
// Used for severe error conditions that may require immediate
// attention or could lead to application failure.
func (l *ProductionLogger) Critical(msg string, fields ...LogField) {
	if l.level <= LogLevelCritical {
		l.log(LogLevelCritical, msg, fields...)
	}
}

// WithContext creates a new logger instance enriched with request context.
// Returns a new logger that includes context information in all log entries
// for distributed tracing and request correlation.
func (l *ProductionLogger) WithContext(ctx context.Context) Logger {
	return &ProductionLogger{
		level:       l.level,
		sessionID:   l.sessionID,
		operationID: l.operationID,
		context:     ctx,
		logger:      l.logger,
	}
}

// WithSession creates a new logger instance enriched with session ID.
// Returns a new logger that includes the session ID in all log entries
// for tracking user sessions and API usage patterns.
func (l *ProductionLogger) WithSession(sessionID string) Logger {
	return &ProductionLogger{
		level:       l.level,
		sessionID:   sessionID,
		operationID: l.operationID,
		context:     l.context,
		logger:      l.logger,
	}
}

// WithOperation creates a new logger instance enriched with operation ID.
// Returns a new logger that includes the operation ID in all log entries
// for tracking specific API operations and their lifecycle.
func (l *ProductionLogger) WithOperation(operationID string) Logger {
	return &ProductionLogger{
		level:       l.level,
		sessionID:   l.sessionID,
		operationID: operationID,
		context:     l.context,
		logger:      l.logger,
	}
}

// log performs the actual logging with structured field formatting.
// Builds formatted log entries with level, message, context fields,
// custom fields, and timestamp for consistent structured output.
func (l *ProductionLogger) log(level LogLevel, msg string, fields ...LogField) {
	// Build structured log entry
	logEntry := fmt.Sprintf("[%s] %s", level.String(), msg)

	// Add context fields
	if l.sessionID != "" {
		logEntry += fmt.Sprintf(" session=%s", l.sessionID)
	}
	if l.operationID != "" {
		logEntry += fmt.Sprintf(" operation=%s", l.operationID)
	}

	// Add custom fields
	for _, field := range fields {
		logEntry += fmt.Sprintf(" %s=%v", field.Key, field.Value)
	}

	// Add timestamp
	logEntry += fmt.Sprintf(" timestamp=%s", time.Now().Format(time.RFC3339Nano))

	l.logger.Println(logEntry)
}

// Global logger instance
var globalLogger Logger = NewProductionLogger(LogLevelInfo)

// SetGlobalLogger sets the global logger instance used by package-level logging functions.
// Allows applications to inject custom logger implementations for testing
// or specialized logging requirements.
func SetGlobalLogger(logger Logger) {
	globalLogger = logger
}

// GetGlobalLogger returns the current global logger instance.
// Used by package-level logging functions and dependency injection
// to access the configured logger implementation.
func GetGlobalLogger() Logger {
	return globalLogger
}

// Package-level logging functions that use the global logger instance.
// Provide convenient access to logging without explicit logger management.
func LogDebug(msg string, fields ...LogField) {
	globalLogger.Debug(msg, fields...)
}

func LogInfo(msg string, fields ...LogField) {
	globalLogger.Info(msg, fields...)
}

func LogWarn(msg string, fields ...LogField) {
	globalLogger.Warn(msg, fields...)
}

func LogError(msg string, fields ...LogField) {
	globalLogger.Error(msg, fields...)
}

func LogCritical(msg string, fields ...LogField) {
	globalLogger.Critical(msg, fields...)
}

// Helper functions for creating commonly used structured log fields.
// Provide type-safe field creation with consistent naming conventions.
// Field creates a structured log field with the specified key and value.
// Provides a convenient way to add arbitrary structured data to log entries.
func Field(key string, value interface{}) LogField {
	return LogField{Key: key, Value: value}
}

// ErrorField creates a structured log field for error information.
// Safely handles nil errors and extracts error messages for structured logging.
func ErrorField(err error) LogField {
	if err != nil {
		return LogField{Key: "error", Value: err.Error()}
	}
	return LogField{Key: "error", Value: "nil"}
}

// DurationField creates a structured log field for duration measurements.
// Formats durations in a human-readable string format for timing analysis.
func DurationField(duration time.Duration) LogField {
	return LogField{Key: "duration", Value: duration.String()}
}

// CountField creates a structured log field for count/quantity values.
// Provides consistent naming for numeric count fields in log entries.
func CountField(count int) LogField {
	return LogField{Key: "count", Value: count}
}

// StatusCodeField creates a structured log field for HTTP status codes.
// Provides consistent naming for status code fields in API operation logs.
func StatusCodeField(code int) LogField {
	return LogField{Key: "status_code", Value: code}
}
