package main

import (
	"context"
	"fmt"
	"log"

	"mediamanager/internal/config"
	"mediamanager/internal/imageservice"
)

func main() {
	app, err := config.Init("data/images.db", "data/metadata.db")
	if err != nil {
		log.Fatalf("Failed to initialize: %v", err)
	}
	defer app.ImageDB.Close()
	defer app.MetaDB.Close()

	imageService := imageservice.NewImageService(app.ImageQueries, app.MetaQueries, "assets")

	fmt.Println("Databases successfully initialized!")
	fmt.Println("ImageService is ready to use.")

	ctx := context.Background()
	if err := imageService.ImportImages(ctx); err != nil {
		log.Fatalf("Failed to import images: %v", err)
	}
}
