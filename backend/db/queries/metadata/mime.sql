-- MIME TYPES --

-- name: InsertMimeType :exec
INSERT INTO mime_types (mime)
VALUES (?);

-- name: SelectMimeTypeByID :one
SELECT id, mime
FROM mime_types
WHERE id = ?;

-- name: SelectMimeTypeByValue :one
SELECT id, mime
FROM mime_types
WHERE mime = ?;

-- name: SelectAllMimeTypes :many
SELECT id, mime
FROM mime_types
ORDER BY mime;
