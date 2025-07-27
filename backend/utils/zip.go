package utils

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"
)

// ZipFiles compresses one or more files into a single zip archive file.
// files is a slice of file paths to add to the archive.
// destZip is the output zip file path.
func ZipFiles(files []string, destZip string) error {
	outFile, err := os.Create(destZip)
	if err != nil {
		return err
	}
	defer outFile.Close()

	zipWriter := zip.NewWriter(outFile)
	defer zipWriter.Close()

	for _, file := range files {
		err = addFileToZip(zipWriter, file)
		if err != nil {
			return err
		}
	}

	return nil
}

// addFileToZip adds a file to the given zip.Writer.
func addFileToZip(zipWriter *zip.Writer, filename string) error {
	fileToZip, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer fileToZip.Close()

	info, err := fileToZip.Stat()
	if err != nil {
		return err
	}

	header, err := zip.FileInfoHeader(info)
	if err != nil {
		return err
	}

	header.Name = filepath.Base(filename)
	header.Method = zip.Deflate

	writer, err := zipWriter.CreateHeader(header)
	if err != nil {
		return err
	}

	_, err = io.Copy(writer, fileToZip)
	return err
}
