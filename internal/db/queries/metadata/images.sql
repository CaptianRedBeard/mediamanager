-- name: CreateImage :exec
INSERT INTO images (
    id, filename, mime_type_id, thumbnail, hash, created_at, edited_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
);

-- name: GetImageByID :one
SELECT * FROM images
WHERE id = ?;

-- name: GetImageByHash :one
SELECT * FROM images
WHERE hash = ?;

-- name: ListImages :many
SELECT images.id, filename, mime, created_at, edited_at
FROM images
JOIN mime_types ON images.mime_type_id = mime_types.id
ORDER BY created_at DESC;

-- name: UpdateImageMetadata :exec
UPDATE images
SET filename = ?, mime_type_id = ?, edited_at = ?
WHERE id = ?;

-- name: DeleteImage :exec
DELETE FROM images
WHERE id = ?;