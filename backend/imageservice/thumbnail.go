package imageservice

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"

	"github.com/nfnt/resize"
)

// generateThumbnail takes raw image bytes and a MIME type and returns a 100x100 thumbnail.
func generateThumbnail(fileBytes []byte, mimeType string) ([]byte, error) {
	img, _, err := image.Decode(bytes.NewReader(fileBytes))
	if err != nil {
		return nil, fmt.Errorf("thumbnail: failed to decode image: %w", err)
	}

	thumb := resize.Thumbnail(100, 100, img, resize.Lanczos3)

	var buf bytes.Buffer
	if err := encodeThumbnail(&buf, thumb, mimeType); err != nil {
		return nil, fmt.Errorf("thumbnail: failed to encode thumbnail: %w", err)
	}

	return buf.Bytes(), nil
}

// encodeThumbnail encodes the image.Image to the writer using the given MIME type.
func encodeThumbnail(w io.Writer, img image.Image, mimeType string) error {
	switch mimeType {
	case "image/png":
		return png.Encode(w, img)
	case "image/jpeg", "image/jpg":
		return jpeg.Encode(w, img, &jpeg.Options{Quality: 80})
	default:
		return fmt.Errorf("thumbnail: unsupported MIME type %q", mimeType)
	}
}
