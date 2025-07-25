-- +goose Up
CREATE TABLE IF NOT EXISTS image_blobs (
    id TEXT PRIMARY KEY,
    data BLOB NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS image_blobs;