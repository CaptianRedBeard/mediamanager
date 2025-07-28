package mediaapi

import (
	"context"
	"encoding/base64"
	"fmt"
	"strings"

	"mediamanager/backend/config"
	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/imageservice"

	"mediamanager/backend/utils"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:generate wails generate bindings

type MediaAPI struct {
	Ctx          context.Context
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

	id, err := m.ImageService.Importer.ImportImage(ctx, filename, fileBytes)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return "", fmt.Errorf("image already exists in the library")
		}
		return "", fmt.Errorf("failed to import %s: %w", filename, err)
	}
	return id, nil
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

// ListAlbumNamesForImage returns the names of albums an image belongs to
func (m MediaAPI) ListAlbumNamesForImage(imageID string) ([]string, error) {
	ctx := context.Background()
	return m.AlbumService.ListAlbumNamesByImage(ctx, imageID)
}

// ListAlbumIDsForImage returns the IDs of albums an image belongs to
func (m *MediaAPI) ListAlbumIDsForImage(imageID string) ([]string, error) {
	ctx := context.Background()
	return m.AlbumService.ListAlbumIDsByImage(ctx, imageID)
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

func (m *MediaAPI) ListAllTags() ([]string, error) {
	ctx := context.Background()
	tags, err := m.ImageService.Tags.ListTags(ctx)
	if err != nil {
		return nil, err
	}

	names := make([]string, 0, len(tags))
	for _, tag := range tags {
		names = append(names, tag.Name)
	}

	return names, nil
}

func (m *MediaAPI) SelectDirectoryDialog() (string, error) {
	return runtime.OpenDirectoryDialog(m.Ctx, runtime.OpenDialogOptions{
		Title: "Select Export Destination",
	})
}

// Export wrappers

func (m *MediaAPI) ExportAlbumToZip(albumName string, destZip string) error {
	ctx := context.Background()
	images, err := m.AlbumService.ListImages(ctx, albumName)
	if err != nil {
		return fmt.Errorf("failed to list images in album: %w", err)
	}

	var filePaths []string
	tempDir, err := os.MkdirTemp("", "album_export")
	if err != nil {
		return fmt.Errorf("failed to create temp dir: %w", err)
	}
	defer os.RemoveAll(tempDir)

	for _, img := range images {
		data, err := m.ImageService.Blobs.Get(ctx, img.ID)
		if err != nil {
			fmt.Println("⚠️ Failed to get blob for image", img.ID, err)
			continue
		}

		mime, err := m.ImageService.Meta.SelectMimeTypeByImageID(ctx, img.ID)
		if err != nil {
			fmt.Println("⚠️ Failed to get MIME for image", img.ID, err)
			continue
		}

		var ext string
		switch mime {
		case "image/jpeg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/gif":
			ext = ".gif"
		default:
			fmt.Println("⚠️ Skipping unsupported MIME type:", mime)
			continue
		}

		filePath := filepath.Join(tempDir, img.ID+ext)
		err = os.WriteFile(filePath, data, 0644)
		if err != nil {
			fmt.Println("⚠️ Failed to write file:", filePath, err)
			continue
		}

		filePaths = append(filePaths, filePath)
	}

	if err := utils.ZipFiles(filePaths, destZip); err != nil {
		return fmt.Errorf("failed to zip files: %w", err)
	}

	return nil
}

func (m *MediaAPI) ExportAlbumToFolder(albumName string, destDir string) error {
	ctx := context.Background()

	images, err := m.AlbumService.ListImages(ctx, albumName)
	if err != nil {
		return fmt.Errorf("failed to list images in album: %w", err)
	}

	albumPath := filepath.Join(destDir, albumName)
	err = os.MkdirAll(albumPath, 0755)
	if err != nil {
		return fmt.Errorf("failed to create album folder: %w", err)
	}

	for _, img := range images {
		data, err := m.ImageService.Blobs.Get(ctx, img.ID)
		if err != nil {
			continue
		}

		mime, err := m.ImageService.Meta.SelectMimeTypeByImageID(ctx, img.ID)
		if err != nil {
			continue
		}

		var ext string
		switch mime {
		case "image/jpeg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/gif":
			ext = ".gif"
		default:
			continue
		}

		filePath := filepath.Join(albumPath, img.ID+ext)
		err = os.WriteFile(filePath, data, 0644)
		if err != nil {
			continue
		}
	}

	return nil
}

func (m *MediaAPI) Startup(ctx context.Context) {
	m.Ctx = ctx
}
