package handlers

import (
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"

	"github.com/gorilla/mux"
)

type DeleteHandler struct {
	ImageService *imageservice.ImageService
}

func NewDeleteHandler(service *imageservice.ImageService) *DeleteHandler {
	return &DeleteHandler{ImageService: service}
}

func (h *DeleteHandler) HandleDelete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.ImageService.DeleteImageByID(r.Context(), id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to delete image", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Image deleted",
		"id":      id,
	})
}
