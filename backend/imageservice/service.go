package imageservice

type ImageService struct {
	Blobs    *BlobService
	Meta     *MetadataService
	Tags     *TagService
	Albums   *AlbumService
	Importer *Importer
}

type TagDTO struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Private   bool   `json:"private"`
	CreatedAt string `json:"created_at"`
	EditedAt  string `json:"edited_at"`
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
