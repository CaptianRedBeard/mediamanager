package imageservice

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"mediamanager/backend/db/generated/metadata"

	"github.com/google/uuid"
)

type MetadataService struct {
	queries *metadata.Queries
}

func NewMetadataService(q *metadata.Queries) *MetadataService {
	return &MetadataService{queries: q}
}

func nowSQLNullTime() sql.NullTime {
	return sql.NullTime{Time: time.Now(), Valid: true}
}

func (m *MetadataService) ImageExistsByHash(ctx context.Context, hash string) (*metadata.Image, bool, error) {
	img, err := m.queries.SelectImageByHash(ctx, hash)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, false, nil
		}
		return nil, false, err
	}
	return &img, true, nil
}

func (m *MetadataService) resolveOrCreateMimeType(ctx context.Context, mimeType string) (metadata.MimeType, error) {
	mime, err := m.queries.SelectMimeTypeByValue(ctx, mimeType)
	if err == nil {
		return mime, nil
	}
	if err != sql.ErrNoRows {
		return metadata.MimeType{}, fmt.Errorf("select mime: %w", err)
	}
	if insertErr := m.queries.InsertMimeType(ctx, mimeType); insertErr != nil {
		return metadata.MimeType{}, fmt.Errorf("insert mime: %w", insertErr)
	}
	mime, err = m.queries.SelectMimeTypeByValue(ctx, mimeType)
	if err != nil {
		return metadata.MimeType{}, fmt.Errorf("reselect mime: %w", err)
	}
	return mime, nil
}

func (m *MetadataService) CreateImageMetadata(ctx context.Context, filename string, fileBytes []byte) (string, error) {
	hash := sha256.Sum256(fileBytes)
	hashStr := hex.EncodeToString(hash[:])

	if existing, exists, err := m.ImageExistsByHash(ctx, hashStr); err != nil {
		return "", err
	} else if exists {
		return existing.ID, nil
	}

	mimeType := http.DetectContentType(fileBytes)
	mime, err := m.resolveOrCreateMimeType(ctx, mimeType)
	if err != nil {
		return "", err
	}

	thumbBytes, err := generateThumbnail(fileBytes, mime.Mime)
	if err != nil {
		return "", fmt.Errorf("generate thumbnail: %w", err)
	}

	imageID := uuid.NewString()
	now := nowSQLNullTime()

	err = m.queries.InsertImage(ctx, metadata.InsertImageParams{
		ID:         imageID,
		Filename:   filename,
		MimeTypeID: mime.ID,
		Thumbnail:  thumbBytes,
		Hash:       hashStr,
		CreatedAt:  now,
		EditedAt:   now,
	})
	if err != nil {
		return "", fmt.Errorf("insert image metadata: %w", err)
	}

	return imageID, nil
}

func (m *MetadataService) GetImageMetadata(ctx context.Context, id string) (*metadata.Image, error) {
	img, err := m.queries.SelectImageByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get image metadata: %w", err)
	}
	return &img, nil
}

func (m *MetadataService) UpdateImageFilenameAndMime(ctx context.Context, id, filename, mimeType string) error {
	mime, err := m.resolveOrCreateMimeType(ctx, mimeType)
	if err != nil {
		return err
	}

	now := nowSQLNullTime()
	return m.queries.UpdateImageMetadataByID(ctx, metadata.UpdateImageMetadataByIDParams{
		ID:         id,
		Filename:   filename,
		MimeTypeID: mime.ID,
		EditedAt:   now,
	})
}

func (m *MetadataService) GetThumbnailAndMime(ctx context.Context, id string) ([]byte, string, error) {
	row, err := m.queries.SelectThumbnailAndMimeByID(ctx, id)
	if err != nil {
		return nil, "", err
	}
	return row.Thumbnail, row.Mime, nil
}

func (m *MetadataService) DeleteImageMetadata(ctx context.Context, id string) error {
	return m.queries.DeleteImageByID(ctx, id)
}

func (m *MetadataService) SelectMimeTypeByImageID(ctx context.Context, id string) (string, error) {
	return m.queries.SelectMimeTypeByImageID(ctx, id)
}

type ImageSummary struct {
	ID        string
	Filename  string
	MimeType  string
	ThumbURL  string
	CreatedAt string
}

func (m *MetadataService) ListImages(ctx context.Context) ([]ImageSummary, error) {
	rows, err := m.queries.SelectAllImagesWithMime(ctx)
	if err != nil {
		return nil, fmt.Errorf("list images: %w", err)
	}

	out := make([]ImageSummary, 0, len(rows))
	for _, r := range rows {
		createdAt := ""
		if r.CreatedAt.Valid {
			createdAt = r.CreatedAt.Time.Format(time.RFC3339)
		}
		out = append(out, ImageSummary{
			ID:        r.ID,
			Filename:  r.Filename,
			MimeType:  r.Mime,
			ThumbURL:  fmt.Sprintf("/thumbs/%s", r.ID),
			CreatedAt: createdAt,
		})
	}

	return out, nil
}

func formatNullTime(nt sql.NullTime) string {
	if nt.Valid {
		return nt.Time.Format(time.RFC3339)
	}
	return ""
}
