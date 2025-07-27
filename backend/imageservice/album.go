package imageservice

import (
	"context"
	"database/sql"
	"fmt"

	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/utils"
)

type AlbumService struct {
	queries *metadata.Queries
}

func NewAlbumService(queries *metadata.Queries) *AlbumService {
	return &AlbumService{queries: queries}
}

// CreateIfMissing finds or creates an album by name and returns its ID
func (s *AlbumService) CreateIfMissing(ctx context.Context, name string) (string, error) {
	album, err := s.queries.SelectAlbumByName(ctx, name)
	if err != nil && err != sql.ErrNoRows {
		return "", err
	}
	if err == nil && album.ID != "" {
		return album.ID, nil
	}

	id := utils.GenerateUUID()
	err = s.queries.InsertAlbum(ctx, metadata.InsertAlbumParams{
		ID:          id,
		Name:        name,
		Description: sql.NullString{String: "", Valid: false},
		Private:     sql.NullInt64{Int64: 0, Valid: true},
	})
	if err != nil {
		return "", err
	}
	return id, nil
}

// AddImage associates an image with an album by name, creating the album if needed
func (s *AlbumService) AddImage(ctx context.Context, imageID string, albumName string) error {
	albumID, err := s.CreateIfMissing(ctx, albumName)
	if err != nil {
		return fmt.Errorf("add image to album: %w", err)
	}

	return s.queries.InsertImageAlbumRelation(ctx, metadata.InsertImageAlbumRelationParams{
		ImageID: imageID,
		AlbumID: albumID,
	})
}

// ListAll returns all albums with their image counts
func (s *AlbumService) ListAll(ctx context.Context) ([]metadata.SelectAllAlbumsWithImageCountRow, error) {
	return s.queries.SelectAllAlbumsWithImageCount(ctx)
}

// ListImages returns detailed images in an album by album name
func (s *AlbumService) ListImages(ctx context.Context, albumName string) ([]metadata.Image, error) {
	album, err := s.queries.SelectAlbumByName(ctx, albumName)
	if err != nil {
		return nil, err
	}
	return s.queries.SelectImagesByAlbumID(ctx, album.ID)
}
