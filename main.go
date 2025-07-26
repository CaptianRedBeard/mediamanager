package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"mediamanager/internal/config"
	"mediamanager/internal/handlers"
	"mediamanager/internal/imageservice"
)

func main() {
	ctx := context.Background()

	// Step 1: Initialize DBs and services
	app, err := config.Init("data/images.db", "data/metadata.db")
	if err != nil {
		log.Fatalf("Failed to initialize: %v", err)
	}
	defer app.ImageDB.Close()
	defer app.MetaDB.Close()

	imageService := imageservice.NewImageService(app.ImageQueries, app.MetaQueries, "assets")
	if err := imageService.ImportImages(ctx); err != nil {
		log.Fatalf("Failed to import images: %v", err)
	}

	// Step 2: Create handlers
	galleryHandler := handlers.NewGalleryHandler(imageService)
	thumbHandler := handlers.NewThumbnailHandler(imageService)
	deleteHandler := handlers.NewDeleteHandler(imageService)
	imageHandler := handlers.NewImageHandler(imageService)
	uploadHandler := handlers.NewUploadHandler(imageService)
	albumsHandler := handlers.NewAlbumsHandler(imageService)

	// Step 3: Set up router and routes
	r := mux.NewRouter()
	r.HandleFunc("/albums", albumsHandler.HandleAlbums).Methods("GET")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleGetAlbum).Methods("GET")
	r.HandleFunc("/albums/add", albumsHandler.HandleAddAlbum).Methods("POST")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleDeleteAlbum).Methods("DELETE")
	r.HandleFunc("/albums/{id}", albumsHandler.HandleUpdateAlbum).Methods("PUT")
	r.HandleFunc("/albums/{id}/images", albumsHandler.HandleAddImagesToAlbum).Methods("POST")
	r.HandleFunc("/albums/{id}/images/{image_id}", albumsHandler.HandleRemoveImageFromAlbum).Methods("DELETE")
	r.HandleFunc("/albums/{id}/images", albumsHandler.HandleListImagesInAlbum).Methods("GET")

	r.HandleFunc("/gallery", galleryHandler.HandleGallery).Methods("GET")
	r.HandleFunc("/thumb/{id}", thumbHandler.HandleThumbnail).Methods("GET")
	r.HandleFunc("/image/{id}", imageHandler.HandleImage).Methods("GET")
	r.HandleFunc("/delete/{id}", deleteHandler.HandleDelete).Methods("DELETE")
	r.HandleFunc("/upload", uploadHandler.HandleUpload).Methods("POST")

	// Step 4: Start HTTP server
	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
