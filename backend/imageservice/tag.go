package imageservice

import (
	"context"
	"database/sql"
	"fmt"

	"mediamanager/backend/db/generated/metadata"
	"mediamanager/backend/utils"
)

type TagService struct {
	q *metadata.Queries
}

func NewTagService(q *metadata.Queries) *TagService {
	return &TagService{q: q}
}

// CreateTag creates a tag if it doesn't exist and returns its ID.
func (s *TagService) CreateTag(ctx context.Context, name string) (string, error) {
	tag, err := s.q.SelectTagByName(ctx, name)
	if err == nil {
		return tag.ID, nil
	}
	if err != sql.ErrNoRows {
		return "", fmt.Errorf("select tag by name: %w", err)
	}

	id := utils.GenerateUUID()
	err = s.q.InsertTag(ctx, metadata.InsertTagParams{
		ID:      id,
		Name:    name,
		Private: false,
	})
	if err != nil {
		return "", fmt.Errorf("insert tag: %w", err)
	}

	return id, nil
}

// TagImage links a tag to an image (no-op if already linked).
func (s *TagService) TagImage(ctx context.Context, imageID string, tagName string) error {
	tagID, err := s.CreateTag(ctx, tagName)
	if err != nil {
		return fmt.Errorf("tag image: %w", err)
	}

	err = s.q.InsertImageTagRelation(ctx, metadata.InsertImageTagRelationParams{
		ImageID: imageID,
		TagID:   tagID,
	})
	if err != nil {
		return fmt.Errorf("link tag to image: %w", err)
	}

	return nil
}

// GetTagsForImage returns a list of tag names assigned to an image.
func (s *TagService) GetTagsForImage(ctx context.Context, imageID string) ([]string, error) {
	tags, err := s.q.SelectTagsByImageID(ctx, imageID)
	if err != nil {
		return nil, fmt.Errorf("select tags by image: %w", err)
	}

	names := make([]string, len(tags))
	for i, tag := range tags {
		names[i] = tag.Name
	}
	return names, nil
}

// GetImagesWithTag returns image IDs associated with a given tag.
func (s *TagService) GetImagesWithTag(ctx context.Context, tagName string) ([]string, error) {
	tag, err := s.q.SelectTagByName(ctx, tagName)
	if err != nil {
		return nil, fmt.Errorf("find tag for image query: %w", err)
	}

	images, err := s.q.SelectImagesByTagID(ctx, tag.ID)
	if err != nil {
		return nil, fmt.Errorf("select images by tag: %w", err)
	}

	imageIDs := make([]string, len(images))
	for i, img := range images {
		imageIDs[i] = img.ID
	}
	return imageIDs, nil
}

// ListTags returns all tags in the database.
func (s *TagService) ListTags(ctx context.Context) ([]metadata.Tag, error) {
	tags, err := s.q.SelectAllTags(ctx)
	if err != nil {
		return nil, fmt.Errorf("list tags: %w", err)
	}
	return tags, nil
}
