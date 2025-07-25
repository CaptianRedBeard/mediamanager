-- +goose Up
CREATE TABLE mime_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mime TEXT NOT NULL UNIQUE
);

INSERT INTO mime_types (mime) VALUES
    ('image/jpeg'),
    ('image/png'),
    ('image/gif'),
    ('image/webp'),
    ('image/bmp');

CREATE TABLE images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    mime_type_id INTEGER NOT NULL,
    thumbnail BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mime_type_id) REFERENCES mime_types(id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS mime_types;
