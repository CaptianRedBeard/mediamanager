package utils

import (
	"errors"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"os"
)

// SaveJPEG saves an image as a JPEG file with the given quality (1-100).
func SaveJPEG(img image.Image, path string, quality int) error {
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	opts := &jpeg.Options{Quality: quality}
	return jpeg.Encode(out, img, opts)
}

// SavePNG saves an image as a PNG file.
func SavePNG(img image.Image, path string) error {
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	return png.Encode(out, img)
}

// SaveGIF saves an image as a GIF file.
func SaveGIF(img image.Image, path string) error {
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	opts := &gif.Options{} // You can customize options if needed
	return gif.Encode(out, img, opts)
}

// LoadImage loads an image from disk regardless of type (JPEG, PNG, GIF).
func LoadImage(path string) (image.Image, string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, "", err
	}
	defer file.Close()

	img, format, err := image.Decode(file)
	if err != nil {
		return nil, "", err
	}
	return img, format, nil
}

// SupportedFormats returns a slice of supported image formats.
func SupportedFormats() []string {
	return []string{"jpeg", "png", "gif"}
}

// ValidateFormat checks if a given format is supported.
func ValidateFormat(format string) error {
	for _, f := range SupportedFormats() {
		if f == format {
			return nil
		}
	}
	return errors.New("unsupported image format: " + format)
}
