package imageservice

type ImageService struct {
	Blobs    *BlobService
	Meta     *MetadataService
	Importer *Importer
}

func New(blobs *BlobService, meta *MetadataService) *ImageService {
	return &ImageService{
		Blobs:    blobs,
		Meta:     meta,
		Importer: NewImporter(blobs, meta),
	}
}
