package handlers

import (
	"mediamanager/internal/imageservice"
	"mediamanager/internal/utils"
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
	ImageURL  string `json:"image_url"`
}

func (h *GalleryHandler) HandleGallery(w http.ResponseWriter, r *http.Request) {
	images, err := h.ImageService.MetaDB.ListImages(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to list images", err)
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
			ImageURL:  "/image/" + img.ID, // New field added
		})
	}

	utils.RespondWithJSON(w, http.StatusOK, items)
}
