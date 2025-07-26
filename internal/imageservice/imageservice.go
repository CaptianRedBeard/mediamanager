package imageservice

import (
	"bytes"
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	imagesdb "mediamanager/internal/db/generated/images"
	metadatadb "mediamanager/internal/db/generated/metadata"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/nfnt/resize"
)

type ImageService struct {
	ImageDB    *imagesdb.Queries
	MetaDB     *metadatadb.Queries
	AssetsPath string
}

func NewImageService(imageDB *imagesdb.Queries, metaDB *metadatadb.Queries, assetsPath string) *ImageService {
	return &ImageService{
		ImageDB:    imageDB,
		MetaDB:     metaDB,
		AssetsPath: assetsPath,
	}
}

func (s *ImageService) importSingleImage(ctx context.Context, path string) error {
	fileBytes, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("reading file %q: %w", path, err)
	}

	// Compute SHA-256 hash
	hasher := sha256.New()
	hasher.Write(fileBytes)
	hash := hex.EncodeToString(hasher.Sum(nil))

	mimeType := http.DetectContentType(fileBytes)

	mime, err := s.MetaDB.GetMimeTypeByValue(ctx, mimeType)
	if err != nil {
		result, insertErr := s.MetaDB.CreateMimeType(ctx, mimeType)
		if insertErr != nil {
			return fmt.Errorf("inserting mime type %q: %w", mimeType, insertErr)
		}

		id, err := result.LastInsertId()
		if err != nil {
			return fmt.Errorf("getting last insert id for mime type %q: %w", mimeType, err)
		}

		mime.ID = int64(id)
		mime.Mime = mimeType
	}

	imageID := uuid.New().String()
	err = s.ImageDB.InsertImageBlob(ctx, imagesdb.InsertImageBlobParams{
		ID:   imageID,
		Data: fileBytes,
	})
	if err != nil {
		return fmt.Errorf("inserting image blob %q: %w", imageID, err)
	}

	img, _, err := image.Decode(bytes.NewReader(fileBytes))
	if err != nil {
		return fmt.Errorf("decoding image %q: %w", path, err)
	}

	thumb := resize.Thumbnail(100, 100, img, resize.Lanczos3)

	var thumbBuf bytes.Buffer
	err = encodeThumbnail(&thumbBuf, thumb, mimeType)
	if err != nil {
		return fmt.Errorf("encoding thumbnail for %q: %w", path, err)
	}

	_, filename := filepath.Split(path)
	now := time.Now()
	sqlNow := sql.NullTime{
		Time:  now,
		Valid: true,
	}

	err = s.MetaDB.CreateImage(ctx, metadatadb.CreateImageParams{
		ID:         imageID,
		Filename:   filename,
		MimeTypeID: mime.ID,
		Thumbnail:  thumbBuf.Bytes(),
		CreatedAt:  sqlNow,
		EditedAt:   sqlNow,
		Hash:       hash,
	})
	if err != nil {
		return fmt.Errorf("creating image metadata for %q: %w", filename, err)
	}

	return nil
}

func (s *ImageService) ImportImages(ctx context.Context) error {
	files, err := os.ReadDir(s.AssetsPath)
	if err != nil {
		return fmt.Errorf("reading assets directory %q: %w", s.AssetsPath, err)
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		imagePath := filepath.Join(s.AssetsPath, file.Name())
		if err := s.importSingleImage(ctx, imagePath); err != nil {
			log.Printf("failed to import %q: %v", file.Name(), err)
		}
	}

	return nil
}

func encodeThumbnail(w io.Writer, img image.Image, mimeType string) error {
	switch mimeType {
	case "image/png":
		return png.Encode(w, img)
	case "image/jpeg":
		return jpeg.Encode(w, img, &jpeg.Options{Quality: 80})
	default:
		return errors.New("unsupported MIME type for thumbnail")
	}
}

func (s *ImageService) GetThumbnailByID(ctx context.Context, id string) ([]byte, string, error) {
	img, err := s.MetaDB.GetImageByID(ctx, id)
	if err != nil {
		return nil, "", fmt.Errorf("image not found: %w", err)
	}

	if len(img.Thumbnail) == 0 {
		return nil, "", fmt.Errorf("thumbnail not found")
	}

	mime, err := s.MetaDB.GetMimeTypeByID(ctx, img.MimeTypeID)
	if err != nil {
		return nil, "", fmt.Errorf("failed to get mime type: %w", err)
	}

	return img.Thumbnail, mime.Mime, nil
}

func (s *ImageService) GetImageBlobByID(ctx context.Context, id string) ([]byte, string, error) {
	blob, err := s.ImageDB.GetImageBlob(ctx, id)
	if err != nil {
		return nil, "", fmt.Errorf("image blob not found: %w", err)
	}

	meta, err := s.MetaDB.GetImageByID(ctx, id)
	if err != nil {
		return nil, "", fmt.Errorf("image metadata not found: %w", err)
	}

	mime, err := s.MetaDB.GetMimeTypeByID(ctx, meta.MimeTypeID)
	if err != nil {
		return nil, "", fmt.Errorf("mime type not found: %w", err)
	}

	return blob, mime.Mime, nil
}

func (s *ImageService) DeleteImageByID(ctx context.Context, id string) error {
	if err := s.ImageDB.DeleteImageBlob(ctx, id); err != nil {
		return fmt.Errorf("deleting blob: %w", err)
	}
	if err := s.MetaDB.DeleteImage(ctx, id); err != nil {
		return fmt.Errorf("deleting metadata: %w", err)
	}
	return nil
}

func (s *ImageService) SaveImage(ctx context.Context, filename string, fileBytes []byte) (string, error) {
	// Compute SHA-256 hash
	hasher := sha256.New()
	hasher.Write(fileBytes)
	hash := hex.EncodeToString(hasher.Sum(nil))

	mimeType := http.DetectContentType(fileBytes)

	mime, err := s.MetaDB.GetMimeTypeByValue(ctx, mimeType)
	if err != nil {
		result, insertErr := s.MetaDB.CreateMimeType(ctx, mimeType)
		if insertErr != nil {
			return "", fmt.Errorf("inserting mime type %q: %w", mimeType, insertErr)
		}

		id, err := result.LastInsertId()
		if err != nil {
			return "", fmt.Errorf("getting last insert id for mime type %q: %w", mimeType, err)
		}

		mime.ID = int64(id)
		mime.Mime = mimeType
	}

	imageID := uuid.New().String()
	err = s.ImageDB.InsertImageBlob(ctx, imagesdb.InsertImageBlobParams{
		ID:   imageID,
		Data: fileBytes,
	})
	if err != nil {
		return "", fmt.Errorf("inserting image blob %q: %w", imageID, err)
	}

	img, _, err := image.Decode(bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("decoding image %q: %w", filename, err)
	}

	thumb := resize.Thumbnail(100, 100, img, resize.Lanczos3)

	var thumbBuf bytes.Buffer
	err = encodeThumbnail(&thumbBuf, thumb, mimeType)
	if err != nil {
		return "", fmt.Errorf("encoding thumbnail for %q: %w", filename, err)
	}

	now := time.Now()
	sqlNow := sql.NullTime{
		Time:  now,
		Valid: true,
	}

	err = s.MetaDB.CreateImage(ctx, metadatadb.CreateImageParams{
		ID:         imageID,
		Filename:   filename,
		MimeTypeID: mime.ID,
		Thumbnail:  thumbBuf.Bytes(),
		CreatedAt:  sqlNow,
		EditedAt:   sqlNow,
		Hash:       hash,
	})
	if err != nil {
		return "", fmt.Errorf("creating image metadata for %q: %w", filename, err)
	}

	return imageID, nil
}

func (s *ImageService) GetAlbumsForImage(ctx context.Context, imageID string) ([]metadatadb.Album, error) {
	return s.MetaDB.ListAlbumsForImage(ctx, imageID)
}

func (s *ImageService) AddAlbum(ctx context.Context, name, description string) (string, error) {
	id := uuid.New().String()

	desc := sql.NullString{
		String: description,
		Valid:  description != "",
	}

	err := s.MetaDB.CreateAlbum(ctx, metadatadb.CreateAlbumParams{
		ID:          id,
		Name:        name,
		Description: desc,
	})

	if err != nil {
		return "", err
	}

	return id, nil
}
