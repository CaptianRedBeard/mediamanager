-- +goose Up
-- Drop old tables
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS tags;

-- Create new albums table with BOOLEAN field
CREATE TABLE albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    private BOOLEAN DEFAULT FALSE, -- true = private, false = public
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create new tags table with BOOLEAN field
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    private BOOLEAN DEFAULT FALSE, -- true = private, false = public
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
-- Drop new tables
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS tags;

-- Recreate old albums table with BOOLEAN field
CREATE TABLE albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    private BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recreate old tags table with BOOLEAN field
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    private BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);