package main

import (
	"context"
	"embed"
	"log"

	"mediamanager/mediaapi"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assetsFS embed.FS

func main() {
	mediaApi, err := mediaapi.NewMediaAPI(context.TODO(), "data/images.db", "data/metadata.db")
	if err != nil {
		log.Fatal("Failed to initialize MediaAPI:", err)
	}

	err = wails.Run(&options.App{
		Title:  "Media Manager",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assetsFS,
		},
		OnStartup: func(ctx context.Context) {
			mediaApi.Startup(ctx)
		},
		Bind: []interface{}{
			mediaApi,
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
