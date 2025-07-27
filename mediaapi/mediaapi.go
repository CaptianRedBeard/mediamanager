package mediaapi

import (
	"context"
	"encoding/base64"
	"fmt"

	"mediamanager/backend/config"
	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/imageservice"
)

//go:generate wails generate bindings

type MediaAPI struct {
	ImageService *imageservice.ImageService
	AlbumService *imageservice.AlbumService
}

func NewMediaAPI(ctx context.Context, imageDBPath, metaDBPath string) (*MediaAPI, error) {
	app, err := config.Init(imageDBPath, metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize databases: %w", err)
	}

	blobService := imageservice.NewBlobService(app.ImageQueries)
	metaService := imageservice.NewMetadataService(app.MetaQueries)
	tagService := imageservice.NewTagService(app.MetaQueries)
	albumService := imageservice.NewAlbumService(app.MetaQueries)

	imageService := imageservice.New(blobService, metaService, tagService, albumService)

	return &MediaAPI{
		ImageService: imageService,
		AlbumService: albumService,
	}, nil
}

func (m *MediaAPI) GetImageBase64(id string) (string, error) {
	ctx := context.Background()

	data, err := m.ImageService.Blobs.Get(ctx, id)
	if err != nil {
		return "", err
	}

	mime, err := m.ImageService.Meta.SelectMimeTypeByImageID(ctx, id)
	if err != nil {
		return "", err
	}

	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:%s;base64,%s", mime, encoded), nil
}

func (m *MediaAPI) GetThumbnailBase64(id string) (string, error) {
	ctx := context.Background()

	data, mime, err := m.ImageService.Meta.GetThumbnailAndMime(ctx, id)
	if err != nil {
		return "", err
	}

	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:%s;base64,%s", mime, encoded), nil
}

// Import a single image
func (m *MediaAPI) ImportImage(filename string, fileBytes []byte) (string, error) {
	ctx := context.Background()
	return m.ImageService.Importer.ImportImage(ctx, filename, fileBytes)
}

// Import images from a directory
func (m *MediaAPI) ImportImagesFromDirectory(dir string) error {
	ctx := context.Background()
	return m.ImageService.ImportImages(ctx, dir)
}

type ThumbnailData struct {
	ID    string `json:"id"`
	Image string `json:"image"`
}

func (m *MediaAPI) GetAllThumbnails() ([]ThumbnailData, error) {
	ctx := context.Background()

	records, err := m.ImageService.Meta.ListImages(ctx)
	if err != nil {
		return nil, err
	}

	thumbnails := make([]ThumbnailData, 0, len(records))
	for _, record := range records {
		tmbn, err := m.GetThumbnailBase64(record.ID)
		if err != nil {
			continue // Skip images we can't get thumbnails for
		}
		thumbnails = append(thumbnails, ThumbnailData{
			ID:    record.ID,
			Image: tmbn,
		})
	}
	return thumbnails, nil
}

// Album-related wrappers

func (m *MediaAPI) CreateAlbumIfMissing(name string) (string, error) {
	ctx := context.Background()
	return m.AlbumService.CreateIfMissing(ctx, name)
}

func (m *MediaAPI) AddImageToAlbum(imageID, albumName string) error {
	ctx := context.Background()
	return m.AlbumService.AddImage(ctx, imageID, albumName)
}

func (m *MediaAPI) ListAllAlbums() ([]metadata.SelectAllAlbumsWithImageCountRow, error) {
	ctx := context.Background()
	return m.AlbumService.ListAll(ctx)
}

func (m *MediaAPI) ListImagesInAlbum(albumName string) ([]metadata.Image, error) {
	ctx := context.Background()
	return m.AlbumService.ListImages(ctx, albumName)
}

// MIME type handling

func (m *MediaAPI) ResolveOrCreateMimeType(mimeType string) (int64, error) {
	ctx := context.Background()
	return m.ImageService.ResolveOrCreateMimeType(ctx, mimeType)
}

// Tagging wrappers

func (m *MediaAPI) CreateTag(name string) (string, error) {
	ctx := context.Background()
	return m.ImageService.Tags.CreateTag(ctx, name)
}

func (m *MediaAPI) TagImage(imageID, tagName string) error {
	ctx := context.Background()
	return m.ImageService.Tags.TagImage(ctx, imageID, tagName)
}

func (m *MediaAPI) GetTagsForImage(imageID string) ([]string, error) {
	ctx := context.Background()
	return m.ImageService.Tags.GetTagsForImage(ctx, imageID)
}

func (m *MediaAPI) GetImagesWithTag(tagName string) ([]string, error) {
	ctx := context.Background()
	return m.ImageService.Tags.GetImagesWithTag(ctx, tagName)
}
