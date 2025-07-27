package backend

import (
	"context"
	"encoding/base64"
	"fmt"
	"mediamanager/backend/imageservice"
)

type MediaAPI struct {
	ImageService *imageservice.ImageService
}

func NewMediaAPI(service *imageservice.ImageService) *MediaAPI {
	return &MediaAPI{ImageService: service}
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
