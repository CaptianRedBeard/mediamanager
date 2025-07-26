CREATE TABLE mime_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mime TEXT NOT NULL UNIQUE
);

CREATE TABLE images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    mime_type_id INTEGER NOT NULL,
    thumbnail BLOB,
    hash TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mime_type_id) REFERENCES mime_types(id) ON DELETE RESTRICT
);

CREATE TABLE albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    private INTEGER DEFAULT 0, -- 0 = public, 1 = private
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


CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    private INTEGER DEFAULT 0, -- 0 = public, 1 = private
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE image_tag (
    image_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, tag_id),
    FOREIGN KEY (image_id) REFERENCES images(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
