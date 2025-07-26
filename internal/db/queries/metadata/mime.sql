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