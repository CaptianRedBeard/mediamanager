package imageservice

type ImageService struct {
	Blobs    *BlobService
	Meta     *MetadataService
	Tags     *TagService
	Albums   *AlbumService
	Importer *Importer
}

func New(blobs *BlobService, meta *MetadataService, tags *TagService, albums *AlbumService) *ImageService {
	return &ImageService{
		Blobs:    blobs,
		Meta:     meta,
		Tags:     tags,
		Albums:   albums,
		Importer: NewImporter(blobs, meta),
	}
}
