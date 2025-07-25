package handlers

import (
	"encoding/json"
	"log"
	"mediamanager/internal/imageservice"
	"net/http"
)

type GalleryHandler struct {
	ImageService *imageservice.ImageService
}

func NewGalleryHandler(svc *imageservice.ImageService) *GalleryHandler {
	return &GalleryHandler{ImageService: svc}
}

type galleryItem struct {
	ID        string `json:"id"`
	Filename  string `json:"filename"`
	Mime      string `json:"mime"`
	CreatedAt string `json:"created_at"`
	ThumbURL  string `json:"thumb_url"`
}

func (h *GalleryHandler) HandleGallery(w http.ResponseWriter, r *http.Request) {
	images, err := h.ImageService.MetaDB.ListImages(r.Context())
	if err != nil {
		http.Error(w, "failed to list images", http.StatusInternalServerError)
		log.Printf("error listing images: %v", err)
		return
	}

	var items []galleryItem
	for _, img := range images {
		var created string
		if img.CreatedAt.Valid {
			created = img.CreatedAt.Time.Format("2006-01-02 15:04")
		}

		items = append(items, galleryItem{
			ID:        img.ID,
			Filename:  img.Filename,
			Mime:      img.Mime,
			CreatedAt: created,
			ThumbURL:  "/thumb/" + img.ID,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
