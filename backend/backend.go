package backend

import (
	//"context"
	//"fmt"

	//"mediamanager/backend/config"
	"mediamanager/backend/imageservice"
	"mediamanager/mediaapi"
)

// Service holds all the domain services and the Wails API
type Service struct {
	ImageService *imageservice.ImageService
	MediaAPI     *mediaapi.MediaAPI
}

/*
// NewService initializes the DB connections and services for Wails frontend
func NewService(ctx context.Context, imageDBPath, metaDBPath string) (*Service, error) {
	// Initialize DB connections and queries
	app, err := config.Init(imageDBPath, metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize databases: %w", err)
	}

	// Create the BlobService and MetadataService using query structs
	blobService := imageservice.NewBlobService(app.ImageQueries)
	metaService := imageservice.NewMetadataService(app.MetaQueries)

	// Initialize the ImageService with the above services and assets directory
	imageService := imageservice.New(blobService, metaService)

	// Create and expose MediaAPI for Wails frontend bindings
	mediaAPI := mediaapi.NewMediaAPI(imageService)

	return &Service{
		ImageService: imageService,
		MediaAPI:     mediaAPI,
	}, nil
}
*/
