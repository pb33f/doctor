// Copyright 2024-2026 Princess Beef Heavy Industries, LLC / Dave Shanley
// https://pb33f.io
// SPDX-License-Identifier: Apache-2.0

package printingpress

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

type sqliteSpecStateStore struct {
	db *sql.DB
}

// NewSQLiteSpecStateStore creates a SQLite-backed persistent state store.
func NewSQLiteSpecStateStore(dbPath string) (SpecStateStore, error) {
	if dbPath == "" {
		return nil, fmt.Errorf("printingpress: sqlite state path is required")
	}
	if err := os.MkdirAll(filepath.Dir(dbPath), 0o755); err != nil {
		return nil, fmt.Errorf("printingpress: creating sqlite state directory: %w", err)
	}
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("printingpress: opening sqlite state store: %w", err)
	}
	store := &sqliteSpecStateStore{db: db}
	if err := store.init(); err != nil {
		_ = db.Close()
		return nil, err
	}
	return store, nil
}

func (s *sqliteSpecStateStore) init() error {
	statements := []string{
		`PRAGMA journal_mode=WAL;`,
		`CREATE TABLE IF NOT EXISTS spec_state (
			namespace TEXT NOT NULL,
			relative_path TEXT NOT NULL,
			hash TEXT NOT NULL,
			config_hash TEXT,
			metadata_version INTEGER,
			title TEXT,
			summary TEXT,
			contact_name TEXT,
			contact_email TEXT,
			service_key TEXT,
			display_name TEXT,
			version TEXT,
			format TEXT,
			output_subdir TEXT,
			updated_at TEXT NOT NULL,
			PRIMARY KEY (namespace, relative_path)
		);`,
	}
	for _, statement := range statements {
		if _, err := s.db.Exec(statement); err != nil {
			return fmt.Errorf("printingpress: initializing sqlite state store: %w", err)
		}
	}
	if _, err := s.db.Exec(`ALTER TABLE spec_state ADD COLUMN summary TEXT`); err != nil && !strings.Contains(err.Error(), "duplicate column name") {
		return fmt.Errorf("printingpress: migrating sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`ALTER TABLE spec_state ADD COLUMN config_hash TEXT`); err != nil && !strings.Contains(err.Error(), "duplicate column name") {
		return fmt.Errorf("printingpress: migrating sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`ALTER TABLE spec_state ADD COLUMN metadata_version INTEGER`); err != nil && !strings.Contains(err.Error(), "duplicate column name") {
		return fmt.Errorf("printingpress: migrating sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`ALTER TABLE spec_state ADD COLUMN contact_name TEXT`); err != nil && !strings.Contains(err.Error(), "duplicate column name") {
		return fmt.Errorf("printingpress: migrating sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`ALTER TABLE spec_state ADD COLUMN contact_email TEXT`); err != nil && !strings.Contains(err.Error(), "duplicate column name") {
		return fmt.Errorf("printingpress: migrating sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`UPDATE spec_state SET summary = '' WHERE summary IS NULL`); err != nil {
		return fmt.Errorf("printingpress: normalizing sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`UPDATE spec_state SET config_hash = '' WHERE config_hash IS NULL`); err != nil {
		return fmt.Errorf("printingpress: normalizing sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`UPDATE spec_state SET metadata_version = 0 WHERE metadata_version IS NULL`); err != nil {
		return fmt.Errorf("printingpress: normalizing sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`UPDATE spec_state SET contact_name = '' WHERE contact_name IS NULL`); err != nil {
		return fmt.Errorf("printingpress: normalizing sqlite state store: %w", err)
	}
	if _, err := s.db.Exec(`UPDATE spec_state SET contact_email = '' WHERE contact_email IS NULL`); err != nil {
		return fmt.Errorf("printingpress: normalizing sqlite state store: %w", err)
	}
	return nil
}

func (s *sqliteSpecStateStore) Load(namespace string) (map[string]*SpecStateRecord, error) {
	rows, err := s.db.Query(
		`SELECT relative_path, hash, config_hash, metadata_version, title, summary, contact_name, contact_email, service_key, display_name, version, format, output_subdir, updated_at
		   FROM spec_state WHERE namespace = ?`,
		namespace,
	)
	if err != nil {
		return nil, fmt.Errorf("printingpress: loading sqlite state: %w", err)
	}
	defer rows.Close()

	records := make(map[string]*SpecStateRecord)
	for rows.Next() {
		var record SpecStateRecord
		var updatedAt string
		var configHash sql.NullString
		var metadataVersion sql.NullInt64
		var title sql.NullString
		var summary sql.NullString
		var contactName sql.NullString
		var contactEmail sql.NullString
		var serviceKey sql.NullString
		var displayName sql.NullString
		var version sql.NullString
		var format sql.NullString
		var outputSubdir sql.NullString
		if err := rows.Scan(
			&record.RelativePath,
			&record.Hash,
			&configHash,
			&metadataVersion,
			&title,
			&summary,
			&contactName,
			&contactEmail,
			&serviceKey,
			&displayName,
			&version,
			&format,
			&outputSubdir,
			&updatedAt,
		); err != nil {
			return nil, fmt.Errorf("printingpress: scanning sqlite state: %w", err)
		}
		record.ConfigHash = configHash.String
		record.MetadataVersion = int(metadataVersion.Int64)
		record.Title = title.String
		record.Summary = summary.String
		record.ContactName = contactName.String
		record.ContactEmail = contactEmail.String
		record.ServiceKey = serviceKey.String
		record.DisplayName = displayName.String
		record.Version = version.String
		record.Format = format.String
		record.OutputSubdir = outputSubdir.String
		if parsed, parseErr := time.Parse(time.RFC3339Nano, updatedAt); parseErr == nil {
			record.UpdatedAt = parsed
		}
		copy := record
		records[record.RelativePath] = &copy
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("printingpress: iterating sqlite state: %w", err)
	}
	return records, nil
}

func (s *sqliteSpecStateStore) Upsert(namespace string, records []*SpecStateRecord) error {
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("printingpress: starting sqlite upsert: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	statement, err := tx.Prepare(`
		INSERT INTO spec_state (
			namespace, relative_path, hash, config_hash, metadata_version, title, summary, contact_name, contact_email, service_key, display_name, version, format, output_subdir, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(namespace, relative_path) DO UPDATE SET
			hash=excluded.hash,
			config_hash=excluded.config_hash,
			metadata_version=excluded.metadata_version,
			title=excluded.title,
			summary=excluded.summary,
			contact_name=excluded.contact_name,
			contact_email=excluded.contact_email,
			service_key=excluded.service_key,
			display_name=excluded.display_name,
			version=excluded.version,
			format=excluded.format,
			output_subdir=excluded.output_subdir,
			updated_at=excluded.updated_at`)
	if err != nil {
		return fmt.Errorf("printingpress: preparing sqlite upsert: %w", err)
	}
	defer statement.Close()

	for _, record := range records {
		if record == nil {
			continue
		}
		updatedAt := record.UpdatedAt
		if updatedAt.IsZero() {
			updatedAt = time.Now().UTC()
		}
		if _, err = statement.Exec(
			namespace,
			record.RelativePath,
			record.Hash,
			record.ConfigHash,
			record.MetadataVersion,
			record.Title,
			record.Summary,
			record.ContactName,
			record.ContactEmail,
			record.ServiceKey,
			record.DisplayName,
			record.Version,
			record.Format,
			record.OutputSubdir,
			updatedAt.Format(time.RFC3339Nano),
		); err != nil {
			return fmt.Errorf("printingpress: executing sqlite upsert: %w", err)
		}
	}
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("printingpress: committing sqlite upsert: %w", err)
	}
	return nil
}

func (s *sqliteSpecStateStore) Delete(namespace string, paths []string) error {
	if len(paths) == 0 {
		return nil
	}
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("printingpress: starting sqlite delete: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	statement, err := tx.Prepare(`DELETE FROM spec_state WHERE namespace = ? AND relative_path = ?`)
	if err != nil {
		return fmt.Errorf("printingpress: preparing sqlite delete: %w", err)
	}
	defer statement.Close()

	for _, relPath := range paths {
		if _, err = statement.Exec(namespace, relPath); err != nil {
			return fmt.Errorf("printingpress: executing sqlite delete: %w", err)
		}
	}
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("printingpress: committing sqlite delete: %w", err)
	}
	return nil
}

func (s *sqliteSpecStateStore) Close() error {
	if s == nil || s.db == nil {
		return nil
	}
	return s.db.Close()
}
