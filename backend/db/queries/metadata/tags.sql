-- name: CreateTag :exec
INSERT INTO tags (id, name, private)
VALUES (?, ?, ?);

-- name: GetTag :one
SELECT * FROM tags
WHERE id = ?;

-- name: ListTags :many
SELECT * FROM tags
ORDER BY created_at DESC;

-- name: UpdateTag :exec
UPDATE tags
SET name = ?,
    private = ?,
    edited_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = ?;

-- name: AddImageToTag :exec
INSERT INTO image_tag (image_id, tag_id)
VALUES (?, ?)
ON CONFLICT(image_id, tag_id) DO NOTHING;

-- name: RemoveImageFromTag :exec
DELETE FROM image_tag
WHERE image_id = ? AND tag_id = ?;

-- name: ListImagesForTag :many
SELECT images.*
FROM images
JOIN image_tag ON images.id = image_tag.image_id
WHERE image_tag.tag_id = ?
ORDER BY images.created_at DESC;

-- name: ListTagsForImage :many
SELECT tags.*
FROM tags
JOIN image_tag ON tags.id = image_tag.tag_id
WHERE image_tag.image_id = ?
ORDER BY tags.created_at DESC;
