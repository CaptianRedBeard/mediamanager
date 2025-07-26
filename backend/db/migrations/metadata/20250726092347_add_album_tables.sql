-- +goose Up

CREATE TABLE albums (
    id TEXT PRIMARY KEY,                                
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE image_album (
    image_id TEXT NOT NULL,
    album_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,      
    PRIMARY KEY (image_id, album_id),
    FOREIGN KEY (image_id) REFERENCES images(id),
    FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- +goose Down
DROP TABLE IF EXISTS image_album;
DROP TABLE IF EXISTS albums;
