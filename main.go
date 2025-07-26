package main

import (
	"context"
	"embed"
	"log"

	"mediamanager/backend"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assetsFS embed.FS

func main() {
	ctx := context.Background()

	// Initialize backend service
	backendService, err := backend.NewService(ctx, "data/images.db", "data/metadata.db")
	if err != nil {
		log.Fatalf("Failed to initialize backend: %v", err)
	}

	// Start HTTP server in background
	go func() {
		if err := backendService.StartServer(":8080"); err != nil {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	// Run Wails app, exposing the MediaAPI directly to the frontend
	err = wails.Run(&options.App{
		Title:  "Media Manager",
		Width:  1024,
		Height: 768,
		Bind: []interface{}{
			backendService.MediaAPI, // Expose MediaAPI directly
		},
		AssetServer: &assetserver.Options{
			Assets: assetsFS,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
