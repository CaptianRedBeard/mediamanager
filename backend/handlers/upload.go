package handlers

import (
	"fmt"
	"io"
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"
)

type UploadHandler struct {
	ImageService *imageservice.ImageService
}

func NewUploadHandler(svc *imageservice.ImageService) *UploadHandler {
	return &UploadHandler{ImageService: svc}
}

func (h *UploadHandler) HandleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "method not allowed", nil)
		return
	}

	contentType := r.Header.Get("Content-Type")
	if contentType == "" || contentType[:19] != "multipart/form-data" {
		utils.RespondWithError(w, http.StatusBadRequest, "content type must be multipart/form-data", nil)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10MB max
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid multipart form", err)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "missing image file", err)
		return
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to read image", err)
		return
	}

	imgID, err := h.ImageService.SaveImage(r.Context(), header.Filename, data)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to save image", err)
		return
	}

	resp := map[string]string{
		"id":        imgID,
		"image_url": fmt.Sprintf("/image/%s", imgID),
		"thumb_url": fmt.Sprintf("/thumb/%s", imgID),
	}
	utils.RespondWithJSON(w, http.StatusOK, resp)
}
