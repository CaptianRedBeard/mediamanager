// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: albums.sql

package metadata

import (
	"context"
	"database/sql"
)

const deleteAlbumByID = `-- name: DeleteAlbumByID :exec
DELETE FROM albums
WHERE id = ?
`

func (q *Queries) DeleteAlbumByID(ctx context.Context, id string) error {
	_, err := q.db.ExecContext(ctx, deleteAlbumByID, id)
	return err
}

const deleteImageAlbumRelation = `-- name: DeleteImageAlbumRelation :exec
DELETE FROM image_album
WHERE image_id = ? AND album_id = ?
`

type DeleteImageAlbumRelationParams struct {
	ImageID string
	AlbumID string
}

func (q *Queries) DeleteImageAlbumRelation(ctx context.Context, arg DeleteImageAlbumRelationParams) error {
	_, err := q.db.ExecContext(ctx, deleteImageAlbumRelation, arg.ImageID, arg.AlbumID)
	return err
}

const insertAlbum = `-- name: InsertAlbum :exec

INSERT INTO albums (id, name, description, private)
VALUES (?, ?, ?, ?)
`

type InsertAlbumParams struct {
	ID          string
	Name        string
	Description sql.NullString
	Private     bool
}

// ALBUMS --
func (q *Queries) InsertAlbum(ctx context.Context, arg InsertAlbumParams) error {
	_, err := q.db.ExecContext(ctx, insertAlbum,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.Private,
	)
	return err
}

const insertImageAlbumRelation = `-- name: InsertImageAlbumRelation :exec

INSERT INTO image_album (image_id, album_id)
VALUES (?, ?)
`

type InsertImageAlbumRelationParams struct {
	ImageID string
	AlbumID string
}

// IMAGE_ALBUM (Linking Images to Albums) --
func (q *Queries) InsertImageAlbumRelation(ctx context.Context, arg InsertImageAlbumRelationParams) error {
	_, err := q.db.ExecContext(ctx, insertImageAlbumRelation, arg.ImageID, arg.AlbumID)
	return err
}

const selectAlbumByID = `-- name: SelectAlbumByID :one
SELECT id, name, description, private, created_at, edited_at
FROM albums
WHERE id = ?
`

func (q *Queries) SelectAlbumByID(ctx context.Context, id string) (Album, error) {
	row := q.db.QueryRowContext(ctx, selectAlbumByID, id)
	var i Album
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Private,
		&i.CreatedAt,
		&i.EditedAt,
	)
	return i, err
}

const selectAlbumByName = `-- name: SelectAlbumByName :one
SELECT id, name, description, private, created_at, edited_at
FROM albums
WHERE name = ?
`

func (q *Queries) SelectAlbumByName(ctx context.Context, name string) (Album, error) {
	row := q.db.QueryRowContext(ctx, selectAlbumByName, name)
	var i Album
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Private,
		&i.CreatedAt,
		&i.EditedAt,
	)
	return i, err
}

const selectAlbumsByImageID = `-- name: SelectAlbumsByImageID :many
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
ORDER BY ia.created_at DESC
`

func (q *Queries) SelectAlbumsByImageID(ctx context.Context, imageID string) ([]Album, error) {
	rows, err := q.db.QueryContext(ctx, selectAlbumsByImageID, imageID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Album
	for rows.Next() {
		var i Album
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Private,
			&i.CreatedAt,
			&i.EditedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const selectAllAlbumsWithImageCount = `-- name: SelectAllAlbumsWithImageCount :many
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
ORDER BY a.created_at DESC
`

type SelectAllAlbumsWithImageCountRow struct {
	ID          string
	Name        string
	Description sql.NullString
	Private     bool
	CreatedAt   sql.NullTime
	EditedAt    sql.NullTime
	ImageCount  int64
}

func (q *Queries) SelectAllAlbumsWithImageCount(ctx context.Context) ([]SelectAllAlbumsWithImageCountRow, error) {
	rows, err := q.db.QueryContext(ctx, selectAllAlbumsWithImageCount)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SelectAllAlbumsWithImageCountRow
	for rows.Next() {
		var i SelectAllAlbumsWithImageCountRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Private,
			&i.CreatedAt,
			&i.EditedAt,
			&i.ImageCount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const selectImagesByAlbumID = `-- name: SelectImagesByAlbumID :many
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
ORDER BY ia.created_at DESC
`

func (q *Queries) SelectImagesByAlbumID(ctx context.Context, albumID string) ([]Image, error) {
	rows, err := q.db.QueryContext(ctx, selectImagesByAlbumID, albumID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Image
	for rows.Next() {
		var i Image
		if err := rows.Scan(
			&i.ID,
			&i.Filename,
			&i.MimeTypeID,
			&i.Thumbnail,
			&i.Hash,
			&i.CreatedAt,
			&i.EditedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const selectPublicAlbumsWithImageCount = `-- name: SelectPublicAlbumsWithImageCount :many
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
ORDER BY a.created_at DESC
`

type SelectPublicAlbumsWithImageCountRow struct {
	ID          string
	Name        string
	Description sql.NullString
	Private     bool
	CreatedAt   sql.NullTime
	EditedAt    sql.NullTime
	ImageCount  int64
}

func (q *Queries) SelectPublicAlbumsWithImageCount(ctx context.Context) ([]SelectPublicAlbumsWithImageCountRow, error) {
	rows, err := q.db.QueryContext(ctx, selectPublicAlbumsWithImageCount)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SelectPublicAlbumsWithImageCountRow
	for rows.Next() {
		var i SelectPublicAlbumsWithImageCountRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Private,
			&i.CreatedAt,
			&i.EditedAt,
			&i.ImageCount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateAlbumByID = `-- name: UpdateAlbumByID :exec
UPDATE albums
SET name = ?, description = ?, private = ?, edited_at = CURRENT_TIMESTAMP
WHERE id = ?
`

type UpdateAlbumByIDParams struct {
	Name        string
	Description sql.NullString
	Private     bool
	ID          string
}

func (q *Queries) UpdateAlbumByID(ctx context.Context, arg UpdateAlbumByIDParams) error {
	_, err := q.db.ExecContext(ctx, updateAlbumByID,
		arg.Name,
		arg.Description,
		arg.Private,
		arg.ID,
	)
	return err
}
