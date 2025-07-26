package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"

	"github.com/gorilla/mux"
)

type AlbumsHandler struct {
	ImageService *imageservice.ImageService
}

func NewAlbumsHandler(svc *imageservice.ImageService) *AlbumsHandler {
	return &AlbumsHandler{ImageService: svc}
}

func (h *AlbumsHandler) HandleAlbums(w http.ResponseWriter, r *http.Request) {
	albums, err := h.ImageService.MetaDB.ListAlbums(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to list albums", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, albums)
}

func (h *AlbumsHandler) HandleGetAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "missing album ID", http.StatusBadRequest)
		return
	}

	album, err := h.ImageService.MetaDB.GetAlbum(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "album not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to get album", http.StatusInternalServerError)
		return
	}

	images, err := h.ImageService.MetaDB.ListImagesInAlbum(r.Context(), id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to list album images", err)
		return
	}

	type ImageResponse struct {
		ID        string `json:"id"`
		Filename  string `json:"filename"`
		MimeType  int64  `json:"mime_type_id"`
		Thumbnail []byte `json:"thumbnail"`
		Hash      string `json:"hash"`
		CreatedAt string `json:"created_at"`
		EditedAt  string `json:"edited_at"`
	}

	type AlbumResponse struct {
		ID          string          `json:"id"`
		Name        string          `json:"name"`
		Description string          `json:"description,omitempty"`
		CreatedAt   string          `json:"created_at"`
		EditedAt    string          `json:"edited_at"`
		Images      []ImageResponse `json:"images"`
	}

	imageResponses := make([]ImageResponse, 0, len(images))
	for _, img := range images {
		imageResponses = append(imageResponses, ImageResponse{
			ID:        img.ID,
			Filename:  img.Filename,
			MimeType:  img.MimeTypeID,
			Thumbnail: img.Thumbnail,
			Hash:      img.Hash,
			CreatedAt: utils.FormatTime(img.CreatedAt),
			EditedAt:  utils.FormatTime(img.EditedAt),
		})
	}

	resp := AlbumResponse{
		ID:          album.ID,
		Name:        album.Name,
		Description: album.Description.String,
		CreatedAt:   utils.FormatTime(album.CreatedAt),
		EditedAt:    utils.FormatTime(album.EditedAt),
		Images:      imageResponses,
	}

	utils.RespondWithJSON(w, http.StatusOK, resp)
}

func (h *AlbumsHandler) HandleAddAlbum(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Name        string `json:"name"`
		Description string `json:"description,omitempty"`
	}

	var req request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "album name is required", http.StatusBadRequest)
		return
	}

	albumID, err := h.ImageService.AddAlbum(r.Context(), req.Name, req.Description)
	if err != nil {
		http.Error(w, "failed to add album", http.StatusInternalServerError)
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, map[string]string{
		"id": albumID,
	})
}

func (h *AlbumsHandler) HandleDeleteAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "missing album ID", http.StatusBadRequest)
		return
	}

	err := h.ImageService.MetaDB.DeleteAlbum(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "album not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to delete album", http.StatusInternalServerError)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"status": "deleted",
		"id":     id,
	})
}

func (h *AlbumsHandler) HandleUpdateAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		http.Error(w, "missing album ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := utils.ParseJSON(r.Body, &req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	err := h.ImageService.MetaDB.UpdateAlbum(r.Context(), metadata.UpdateAlbumParams{
		ID:   id,
		Name: req.Name,
		Description: sql.NullString{
			String: req.Description,
			Valid:  req.Description != "",
		},
	})

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to update album", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AlbumsHandler) HandleAddImagesToAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	albumID := vars["id"]

	if albumID == "" {
		http.Error(w, "missing album ID", http.StatusBadRequest)
		return
	}

	var req struct {
		ImageIDs []string `json:"image_ids"`
	}

	if err := utils.ParseJSON(r.Body, &req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	if len(req.ImageIDs) == 0 {
		http.Error(w, "no image IDs provided", http.StatusBadRequest)
		return
	}

	for _, imgID := range req.ImageIDs {
		err := h.ImageService.MetaDB.AddImageToAlbum(r.Context(), metadata.AddImageToAlbumParams{
			AlbumID: albumID,
			ImageID: imgID,
		})
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "failed to add image to album", err)
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]any{
		"album_id":  albumID,
		"image_ids": req.ImageIDs,
		"status":    "added",
	})
}

func (h *AlbumsHandler) HandleRemoveImageFromAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	albumID := vars["id"]
	imageID := vars["image_id"]

	if albumID == "" || imageID == "" {
		http.Error(w, "missing album ID or image ID", http.StatusBadRequest)
		return
	}

	err := h.ImageService.MetaDB.RemoveImageFromAlbum(r.Context(), metadata.RemoveImageFromAlbumParams{
		AlbumID: albumID,
		ImageID: imageID,
	})
	if err != nil {
		// may want to break out failure for not having any images in the album ie album empty
		http.Error(w, "failed to remove image from album", http.StatusInternalServerError)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"status":   "removed",
		"album_id": albumID,
		"image_id": imageID,
	})
}

func (h *AlbumsHandler) HandleListImagesInAlbum(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	albumID := vars["id"]

	if albumID == "" {
		http.Error(w, "missing album ID", http.StatusBadRequest)
		return
	}

	images, err := h.ImageService.MetaDB.ListImagesInAlbum(r.Context(), albumID)
	if err != nil {
		http.Error(w, "failed to list images in album", http.StatusInternalServerError)
		return
	}

	type ImageResponse struct {
		ID        string `json:"id"`
		Filename  string `json:"filename"`
		MimeType  int64  `json:"mime_type_id"`
		Thumbnail []byte `json:"thumbnail"`
		Hash      string `json:"hash"`
		CreatedAt string `json:"created_at"`
		EditedAt  string `json:"edited_at"`
	}

	imageResponses := make([]ImageResponse, 0, len(images))
	for _, img := range images {
		createdAt := ""
		if img.CreatedAt.Valid {
			createdAt = img.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00")
		}
		editedAt := ""
		if img.EditedAt.Valid {
			editedAt = img.EditedAt.Time.Format("2006-01-02T15:04:05Z07:00")
		}

		imageResponses = append(imageResponses, ImageResponse{
			ID:        img.ID,
			Filename:  img.Filename,
			MimeType:  img.MimeTypeID,
			Thumbnail: img.Thumbnail,
			Hash:      img.Hash,
			CreatedAt: createdAt,
			EditedAt:  editedAt,
		})
	}

	utils.RespondWithJSON(w, http.StatusOK, imageResponses)
}
