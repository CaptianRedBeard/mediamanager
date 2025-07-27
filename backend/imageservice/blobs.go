package imageservice

import (
	"context"
	"fmt"

	"mediamanager/backend/db/generated/images"
)

// BlobService provides high-level access to the raw image blobs.
type BlobService struct {
	queries *images.Queries
}

func NewBlobService(q *images.Queries) *BlobService {
	return &BlobService{queries: q}
}

// Get retrieves the raw blob data for the image by id.
func (b *BlobService) Get(ctx context.Context, id string) ([]byte, error) {
	data, err := b.queries.GetImageBlob(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("blobservice: Get: %w", err)
	}
	return data, nil
}

// Insert adds a new image blob.
func (b *BlobService) Insert(ctx context.Context, id string, data []byte) error {
	err := b.queries.InsertImageBlob(ctx, images.InsertImageBlobParams{
		ID:   id,
		Data: data,
	})
	if err != nil {
		return fmt.Errorf("blobservice: Insert: %w", err)
	}
	return nil
}

// Delete removes an image blob by id.
func (b *BlobService) Delete(ctx context.Context, id string) error {
	err := b.queries.DeleteImageBlob(ctx, id)
	if err != nil {
		return fmt.Errorf("blobservice: Delete: %w", err)
	}
	return nil
}
