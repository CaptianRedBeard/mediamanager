package config

import (
	"database/sql"
	"fmt"

	imagedb "mediamanager/backend/db/generated/images"
	metadb "mediamanager/backend/db/generated/metadata"

	_ "github.com/mattn/go-sqlite3"
)

type AppConfig struct {
	ImageDB      *sql.DB
	MetaDB       *sql.DB
	ImageQueries *imagedb.Queries
	MetaQueries  *metadb.Queries
}

func Init(imageDBPath, metaDBPath string) (*AppConfig, error) {
	imageDB, err := sql.Open("sqlite3", imageDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open image DB: %w", err)
	}

	metaDB, err := sql.Open("sqlite3", metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open metadata DB: %w", err)
	}

	return &AppConfig{
		ImageDB:      imageDB,
		MetaDB:       metaDB,
		ImageQueries: imagedb.New(imageDB),
		MetaQueries:  metadb.New(metaDB),
	}, nil
}
