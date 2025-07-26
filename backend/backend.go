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

type Service struct {
	ImageService *imageservice.ImageService
	Router       *mux.Router
}

// NewService initializes DB, services, router, and handlers
func NewService(ctx context.Context, imageDBPath, metaDBPath string) (*Service, error) {
	// Initialize DB connections
	app, err := config.Init(imageDBPath, metaDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize: %w", err)
	}

	// Optionally handle closing DBs when Service is stopped (you could add Close() method)

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

	// Setup router and routes
	r := mux.NewRouter()
	r.HandleFunc("/gallery", galleryHandler.HandleGallery).Methods("GET")
	r.HandleFunc("/thumb/{id}", thumbHandler.HandleThumbnail).Methods("GET")
	r.HandleFunc("/image/{id}", imageHandler.HandleImage).Methods("GET")
	r.HandleFunc("/delete/{id}", deleteHandler.HandleDelete).Methods("DELETE")
	r.HandleFunc("/upload", uploadHandler.HandleUpload).Methods("POST")

	return &Service{
		ImageService: imageService,
		Router:       r,
	}, nil
}

// StartServer runs the HTTP server on a given port (blocking call)
func (s *Service) StartServer(addr string) error {
	fmt.Printf("Server running at http://%s\n", addr)
	return http.ListenAndServe(addr, s.Router)
}
