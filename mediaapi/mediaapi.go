package mediaapi

import (
	"context"
	"encoding/base64"
	"fmt"
	"mediamanager/backend/config"
	"mediamanager/backend/imageservice"
)

//go:generate wails generate bindings

type MediaAPI struct {
	ImageService *imageservice.ImageService
}

func NewMediaAPI(ctx context.Context, imageDBPath, metaDBPath string) (*MediaAPI, error) {
	app, err := config.Init(imageDBPath, metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize databases: %w", err)
	}

	// Create the BlobService and MetadataService using query structs
	blobService := imageservice.NewBlobService(app.ImageQueries)
	metaService := imageservice.NewMetadataService(app.MetaQueries)

	// Initialize the ImageService with the above services and assets directory
	imageService := imageservice.New(blobService, metaService)
	return &MediaAPI{ImageService: imageService}, err
}

func (m *MediaAPI) GetImageBase64(id string) (string, error) {
	data, err := m.ImageService.Blobs.Get(context.Background(), id)
	if err != nil {
		return "", err
	}
	mime, err := m.ImageService.Meta.SelectMimeTypeByImageID(context.Background(), id)
	if err != nil {
		return "", err
	}
	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:%s;base64,%s", mime, encoded), nil
}

func (m *MediaAPI) GetThumbnailBase64(id string) (string, error) {
	data, mime, err := m.ImageService.Meta.GetThumbnailAndMime(context.Background(), id)
	if err != nil {
		return "", err
	}
	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:%s;base64,%s", mime, encoded), nil
}

func (m *MediaAPI) ImportImage(filename string, fileBytes []byte) (string, error) {
	ctx := context.Background()
	return m.ImageService.Importer.ImportImage(ctx, filename, fileBytes)
}
