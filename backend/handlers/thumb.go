package handlers

import (
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"
	"strings"
)

type ThumbnailHandler struct {
	ImageService *imageservice.ImageService
}

func NewThumbnailHandler(svc *imageservice.ImageService) *ThumbnailHandler {
	return &ThumbnailHandler{ImageService: svc}
}

func (h *ThumbnailHandler) HandleThumbnail(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/thumb/")
	if id == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "missing image ID", nil)
		return
	}

	thumb, mime, err := h.ImageService.GetThumbnailByID(r.Context(), id)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "thumbnail not found", err)
		return
	}

	w.Header().Set("Content-Type", mime)
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(thumb)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to write thumbnail", err)
	}
}
