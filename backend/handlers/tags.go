package handlers

import (
	"database/sql"
	"errors"
	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/imageservice"
	"mediamanager/backend/utils"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type TagsHandler struct {
	ImageService *imageservice.ImageService
}

func NewTagsHandler(svc *imageservice.ImageService) *TagsHandler {
	return &TagsHandler{ImageService: svc}
}

func (h *TagsHandler) HandleListTags(w http.ResponseWriter, r *http.Request) {
	tags, err := h.ImageService.ListTags(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to list tags", err)
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, tags)
}

func (h *TagsHandler) HandleGetImagesForTag(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if id == "" {
		http.Error(w, "missing tag ID", http.StatusBadRequest)
		return
	}

	images, err := h.ImageService.MetaDB.ListImagesForTag(r.Context(), id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to list images for tag", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, images)
}

func (h *TagsHandler) HandleAddTag(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name    string `json:"name"`
		Private bool   `json:"private"`
	}
	if err := utils.ParseJSON(r.Body, &req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	id := uuid.New().String()
	privateVal := sql.NullInt64{}
	if req.Private {
		privateVal = sql.NullInt64{Int64: 1, Valid: true}
	}

	err := h.ImageService.MetaDB.CreateTag(r.Context(), metadata.CreateTagParams{
		ID:      id,
		Name:    req.Name,
		Private: privateVal,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to create tag", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, map[string]string{"id": id})
}

func (h *TagsHandler) HandleUpdateTag(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if id == "" {
		http.Error(w, "missing tag ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Name    string `json:"name"`
		Private bool   `json:"private"`
	}
	if err := utils.ParseJSON(r.Body, &req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	privateVal := sql.NullInt64{}
	if req.Private {
		privateVal = sql.NullInt64{Int64: 1, Valid: true}
	}

	err := h.ImageService.MetaDB.UpdateTag(r.Context(), metadata.UpdateTagParams{
		ID:      id,
		Name:    req.Name,
		Private: privateVal,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to update tag", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *TagsHandler) HandleDeleteTag(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if id == "" {
		http.Error(w, "missing tag ID", http.StatusBadRequest)
		return
	}

	err := h.ImageService.MetaDB.DeleteTag(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "tag not found", http.StatusNotFound)
			return
		}
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to delete tag", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"status": "deleted",
		"id":     id,
	})
}

func (h *TagsHandler) HandleAddImagesToTag(w http.ResponseWriter, r *http.Request) {
	tagID := mux.Vars(r)["id"]
	if tagID == "" {
		http.Error(w, "missing tag ID", http.StatusBadRequest)
		return
	}

	var req struct {
		ImageIDs []string `json:"image_ids"`
	}
	if err := utils.ParseJSON(r.Body, &req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	for _, imageID := range req.ImageIDs {
		err := h.ImageService.AddTagToImage(r.Context(), imageID, tagID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "failed to tag image "+imageID, err)
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]any{
		"tag_id":    tagID,
		"image_ids": req.ImageIDs,
		"status":    "tagged",
	})
}

func (h *TagsHandler) HandleRemoveImageFromTag(w http.ResponseWriter, r *http.Request) {
	tagID := mux.Vars(r)["id"]
	imageID := mux.Vars(r)["image_id"]
	if tagID == "" || imageID == "" {
		http.Error(w, "missing tag ID or image ID", http.StatusBadRequest)
		return
	}

	err := h.ImageService.RemoveTagFromImage(r.Context(), imageID, tagID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "failed to remove image from tag", err)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"status":   "untagged",
		"tag_id":   tagID,
		"image_id": imageID,
	})
}
