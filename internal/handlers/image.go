package handlers

import (
	"mediamanager/internal/imageservice"
	"mediamanager/internal/utils"
	"net/http"

	"github.com/gorilla/mux"
)

type ImageHandler struct {
	ImageService *imageservice.ImageService
}

func NewImageHandler(svc *imageservice.ImageService) *ImageHandler {
	return &ImageHandler{ImageService: svc}
}

func (h *ImageHandler) HandleImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	data, mime, err := h.ImageService.GetImageBlobByID(r.Context(), id)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Image not found", err)
		return
	}

	w.Header().Set("Content-Type", mime)
	w.WriteHeader(http.StatusOK)
	if _, err := w.Write(data); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to write image data", err)
	}
}
