-- name: InsertImageBlob :exec
INSERT INTO image_blobs (id, data)
VALUES (?, ?);

-- name: GetImageBlob :one
SELECT data
FROM image_blobs
WHERE id = ?;

-- name: DeleteImageBlob :exec
DELETE FROM image_blobs
WHERE id = ?;
