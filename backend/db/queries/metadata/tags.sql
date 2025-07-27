-- TAGS --

-- name: InsertTag :exec
INSERT INTO tags (id, name, private)
VALUES (?, ?, ?);

-- name: SelectTagByID :one
SELECT id, name, private, created_at, edited_at
FROM tags
WHERE id = ?;

-- name: SelectTagByName :one
SELECT id, name, private, created_at, edited_at
FROM tags
WHERE name = ?;

-- name: SelectAllTags :many
SELECT id, name, private, created_at, edited_at
FROM tags
ORDER BY created_at DESC;

-- name: UpdateTagByID :exec
UPDATE tags
SET name = ?,
    private = ?,
    edited_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: DeleteTagByID :exec
DELETE FROM tags
WHERE id = ?;

-- IMAGE_TAG (Linking Images to Tags) --

-- name: InsertImageTagRelation :exec
INSERT INTO image_tag (image_id, tag_id)
VALUES (?, ?)
ON CONFLICT(image_id, tag_id) DO NOTHING;

-- name: DeleteImageTagRelation :exec
DELETE FROM image_tag
WHERE image_id = ? AND tag_id = ?;

-- name: SelectImagesByTagID :many
SELECT
    i.id,
    i.filename,
    i.mime_type_id,
    i.thumbnail,
    i.hash,
    i.created_at,
    i.edited_at
FROM images i
JOIN image_tag it ON i.id = it.image_id
WHERE it.tag_id = ?
ORDER BY i.created_at DESC;

-- name: SelectTagsByImageID :many
SELECT
    t.id,
    t.name,
    t.private,
    t.created_at,
    t.edited_at
FROM tags t
JOIN image_tag it ON t.id = it.tag_id
WHERE it.image_id = ?
ORDER BY t.created_at DESC;
