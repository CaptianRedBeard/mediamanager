-- IMAGES --

-- name: InsertImage :exec
INSERT INTO images (
    id, filename, mime_type_id, thumbnail, hash, created_at, edited_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
);

-- name: SelectImageByID :one
SELECT
    id, filename, mime_type_id, thumbnail, hash, created_at, edited_at
FROM images
WHERE id = ?;

-- name: SelectImageByHash :one
SELECT
    id, filename, mime_type_id, thumbnail, hash, created_at, edited_at
FROM images
WHERE hash = ?;

-- name: SelectAllImagesWithMime :many
SELECT
    i.id,
    i.filename,
    i.mime_type_id,
    m.mime,
    i.thumbnail,
    i.hash,
    i.created_at,
    i.edited_at
FROM images i
JOIN mime_types m ON i.mime_type_id = m.id
ORDER BY i.created_at DESC;

-- name: UpdateImageMetadataByID :exec
UPDATE images
SET filename = ?, mime_type_id = ?, edited_at = ?
WHERE id = ?;

-- name: DeleteImageByID :exec
DELETE FROM images
WHERE id = ?;

-- name: SelectThumbnailByID :one
SELECT thumbnail
FROM images
WHERE id = ?;

-- name: SelectThumbnailAndMimeByID :one
SELECT i.thumbnail, m.mime
FROM images i
JOIN mime_types m ON i.mime_type_id = m.id
WHERE i.id = ?;

-- name: SelectImagesByMimeTypeID :many
SELECT
    i.id,
    i.filename,
    i.mime_type_id,
    m.mime,
    i.thumbnail,
    i.hash,
    i.created_at,
    i.edited_at
FROM images i
JOIN mime_types m ON i.mime_type_id = m.id
WHERE i.mime_type_id = ?
ORDER BY i.created_at DESC;

-- name: SelectImagesByDateRange :many
SELECT
    i.id,
    i.filename,
    i.mime_type_id,
    m.mime,
    i.thumbnail,
    i.hash,
    i.created_at,
    i.edited_at
FROM images i
JOIN mime_types m ON i.mime_type_id = m.id
WHERE i.created_at BETWEEN ? AND ?
ORDER BY i.created_at DESC;

-- name: SelectMimeTypeByImageID :one
SELECT m.mime
FROM images i
JOIN mime_types m ON i.mime_type_id = m.id
WHERE i.id = ?;