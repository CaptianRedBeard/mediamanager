package backend

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"

	"mediamanager/backend/config"
	"mediamanager/backend/handlers"
	"mediamanager/backend/imageservice"
)

// Service encapsulates HTTP handlers and services
type Service struct {
	ImageService *imageservice.ImageService
	Router       *mux.Router
	MediaAPI     *MediaAPI
}

// NewService initializes DB, services, router, handlers, and Wails API
func NewService(ctx context.Context, imageDBPath, metaDBPath string) (*Service, error) {
	// Initialize DB connections
	app, err := config.Init(imageDBPath, metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize: %w", err)
	}

	// Initialize image service
	imageService := imageservice.NewImageService(app.ImageQueries, app.MetaQueries, "assets")

	// Import images once on startup
	if err := imageService.ImportImages(ctx); err != nil {
		return nil, fmt.Errorf("failed to import images: %w", err)
	}

	// Create handlers
	galleryHandler := handlers.NewGalleryHandler(imageService)
	thumbHandler := handlers.NewThumbnailHandler(imageService)
	deleteHandler := handlers.NewDeleteHandler(imageService)
	imageHandler := handlers.NewImageHandler(imageService)
	uploadHandler := handlers.NewUploadHandler(imageService)
	tagsHandler := handlers.NewTagsHandler(imageService)
	albumsHandler := handlers.NewAlbumsHandler(imageService)

	// Setup router and routes
	r := mux.NewRouter()

	r.HandleFunc("/gallery", galleryHandler.HandleGallery).Methods("GET")
	r.HandleFunc("/thumb/{id}", thumbHandler.HandleThumbnail).Methods("GET")
	r.HandleFunc("/image/{id}", imageHandler.HandleImage).Methods("GET")
	r.HandleFunc("/delete/{id}", deleteHandler.HandleDelete).Methods("DELETE")
	r.HandleFunc("/upload", uploadHandler.HandleUpload).Methods("POST")

	r.HandleFunc("/tags", tagsHandler.HandleListTags).Methods("GET")
	r.HandleFunc("/tags", tagsHandler.HandleAddTag).Methods("POST")
	r.HandleFunc("/tags/{id}", tagsHandler.HandleUpdateTag).Methods("PUT")
	r.HandleFunc("/tags/{id}", tagsHandler.HandleDeleteTag).Methods("DELETE")
	r.HandleFunc("/tags/{id}/images", tagsHandler.HandleGetImagesForTag).Methods("GET")
	r.HandleFunc("/tags/{id}/images", tagsHandler.HandleAddImagesToTag).Methods("POST")
	r.HandleFunc("/tags/{id}/images/{image_id}", tagsHandler.HandleRemoveImageFromTag).Methods("DELETE")

	r.HandleFunc("/albums", albumsHandler.HandleAlbums).Methods("GET")
	r.HandleFunc("/albums", albumsHandler.HandleAddAlbum).Methods("POST")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleGetAlbum).Methods("GET")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleUpdateAlbum).Methods("PUT")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleDeleteAlbum).Methods("DELETE")
	r.HandleFunc("/albums/{id}/images", albumsHandler.HandleListImagesInAlbum).Methods("GET")
	r.HandleFunc("/albums/{id}/images", albumsHandler.HandleAddImagesToAlbum).Methods("POST")
	r.HandleFunc("/albums/{id}/images/{image_id}", albumsHandler.HandleRemoveImageFromAlbum).Methods("DELETE")

	// ✅ Create and attach MediaAPI for Wails
	mediaAPI := NewMediaAPI(imageService)

	return &Service{
		ImageService: imageService,
		Router:       r,
		MediaAPI:     mediaAPI,
	}, nil
}

// StartServer runs the HTTP server on a given port (blocking call)
func (s *Service) StartServer(addr string) error {
	fmt.Printf("Server running at http://%s\n", addr)
	return http.ListenAndServe(addr, s.Router)
}
