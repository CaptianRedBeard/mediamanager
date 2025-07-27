-- ALBUMS --

-- name: InsertAlbum :exec
INSERT INTO albums (id, name, description, private)
VALUES (?, ?, ?, ?);

-- name: SelectAlbumByID :one
SELECT id, name, description, private, created_at, edited_at
FROM albums
WHERE id = ?;

-- name: SelectAlbumByName :one
SELECT id, name, description, private, created_at, edited_at
FROM albums
WHERE name = ?;

-- name: SelectAllAlbumsWithImageCount :many
SELECT
    a.id,
    a.name,
    a.description,
    a.private,
    a.created_at,
    a.edited_at,
    COUNT(ia.image_id) AS image_count
FROM albums a
LEFT JOIN image_album ia ON a.id = ia.album_id
GROUP BY a.id
ORDER BY a.created_at DESC;

-- name: SelectPublicAlbumsWithImageCount :many
SELECT
    a.id,
    a.name,
    a.description,
    a.private,
    a.created_at,
    a.edited_at,
    COUNT(ia.image_id) AS image_count
FROM albums a
LEFT JOIN image_album ia ON a.id = ia.album_id
WHERE a.private = 0
GROUP BY a.id
ORDER BY a.created_at DESC;

-- name: UpdateAlbumByID :exec
UPDATE albums
SET name = ?, description = ?, private = ?, edited_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: DeleteAlbumByID :exec
DELETE FROM albums
WHERE id = ?;

-- IMAGE_ALBUM (Linking Images to Albums) --

-- name: InsertImageAlbumRelation :exec
INSERT INTO image_album (image_id, album_id)
VALUES (?, ?);

-- name: DeleteImageAlbumRelation :exec
DELETE FROM image_album
WHERE image_id = ? AND album_id = ?;

-- name: SelectImagesByAlbumID :many
SELECT
    i.id,
    i.filename,
    i.mime_type_id,
    i.thumbnail,
    i.hash,
    i.created_at,
    i.edited_at
FROM images i
JOIN image_album ia ON i.id = ia.image_id
WHERE ia.album_id = ?
ORDER BY ia.created_at DESC;

-- name: SelectAlbumsByImageID :many
SELECT
    a.id,
    a.name,
    a.description,
    a.private,
    a.created_at,
    a.edited_at
FROM albums a
JOIN image_album ia ON a.id = ia.album_id
WHERE ia.image_id = ?
ORDER BY ia.created_at DESC;
