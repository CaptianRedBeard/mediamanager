-- name: CreateMimeType :execresult
INSERT INTO mime_types (mime)
VALUES (?);

-- name: GetMimeTypeByID :one
SELECT id, mime FROM mime_types
WHERE id = ?;

-- name: GetMimeTypeByValue :one
SELECT id, mime FROM mime_types
WHERE mime = ?;

-- name: ListMimeTypes :many
SELECT id, mime FROM mime_types
ORDER BY mime;

-- name: CreateImage :exec
INSERT INTO images (
    id, filename, mime_type_id, thumbnail, created_at, edited_at
) VALUES (
    ?, ?, ?, ?, ?, ?
);

-- name: GetImageByID :one
SELECT * FROM images
WHERE id = ?;

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
