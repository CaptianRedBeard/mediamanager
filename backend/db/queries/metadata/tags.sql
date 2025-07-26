-- name: CreateTag :exec
INSERT INTO tags (id, name, private)
VALUES ($1, $2, $3);

-- name: GetTag :one
SELECT * FROM tags
WHERE id = $1;

-- name: ListTags :many
SELECT * FROM tags
ORDER BY created_at DESC;

-- name: UpdateTag :exec
UPDATE tags
SET name = $2,
    private = $3,
    edited_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = $1;

-- name: AddImageToTag :exec
INSERT INTO image_tag (image_id, tag_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: RemoveImageFromTag :exec
DELETE FROM image_tag
WHERE image_id = $1 AND tag_id = $2;

-- name: ListImagesForTag :many
SELECT images.*
FROM images
JOIN image_tag ON images.id = image_tag.image_id
WHERE image_tag.tag_id = $1
ORDER BY images.created_at DESC;
