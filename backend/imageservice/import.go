package imageservice

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

type Importer struct {
	Blobs *BlobService
	Meta  *MetadataService
}

func NewImporter(blobs *BlobService, meta *MetadataService) *Importer {
	return &Importer{
		Blobs: blobs,
		Meta:  meta,
	}
}

func (im *Importer) ImportImage(ctx context.Context, filename string, fileBytes []byte) (string, error) {
	imageID, err := im.Meta.CreateImageMetadata(ctx, filepath.Base(filename), fileBytes)
	if err != nil {
		return "", fmt.Errorf("failed to create metadata: %w", err)
	}

	err = im.Blobs.Insert(ctx, imageID, fileBytes)
	if err != nil {
		return "", fmt.Errorf("failed to save image blob: %w", err)
	}

	return imageID, nil
}

func (s *ImageService) ImportImages(ctx context.Context, dir string) error {
	files, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read dir %s: %w", dir, err)
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}
		filePath := filepath.Join(dir, file.Name())

		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("read file %s: %w", filePath, err)
		}

		_, err = s.Importer.ImportImage(ctx, file.Name(), data)
		if err != nil {
			return fmt.Errorf("import image %s: %w", file.Name(), err)
		}
	}

	return nil
}
