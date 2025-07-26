package handlers

import (
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"
)

type GalleryHandler struct {
	ImageService *imageservice.ImageService
}

func NewGalleryHandler(svc *imageservice.ImageService) *GalleryHandler {
	return &GalleryHandler{ImageService: svc}
}

type galleryItem struct {
	ID        string   `json:"id"`
	Filename  string   `json:"filename"`
	Mime      string   `json:"mime"`
	CreatedAt string   `json:"created_at"`
	ThumbURL  string   `json:"thumb_url"`
	ImageURL  string   `json:"image_url"`
	Albums    []string `json:"albums"` // Do you want full data or just the album name?
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

		albumsStructs, err := h.ImageService.GetAlbumsForImage(r.Context(), img.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "failed to get albums", err)
			return
		}

		albumNames := make([]string, len(albumsStructs))
		for i, album := range albumsStructs {
			albumNames[i] = album.Name
		}

		items = append(items, galleryItem{
			ID:        img.ID,
			Filename:  img.Filename,
			Mime:      img.Mime,
			CreatedAt: created,
			ThumbURL:  "/thumb/" + img.ID,
			ImageURL:  "/image/" + img.ID,
			Albums:    albumNames,
		})
	}

	utils.RespondWithJSON(w, http.StatusOK, items)
}
