package imageservice

import (
	"context"
	"database/sql"
	"fmt"
)

func (s *ImageService) ResolveOrCreateMimeType(ctx context.Context, mimeType string) (int64, error) {
	mime, err := s.Meta.queries.SelectMimeTypeByValue(ctx, mimeType)
	if err == nil {
		return mime.ID, nil
	}

	if err != sql.ErrNoRows {
		return 0, fmt.Errorf("select mime %q: %w", mimeType, err)
	}

	if insertErr := s.Meta.queries.InsertMimeType(ctx, mimeType); insertErr != nil {
		return 0, fmt.Errorf("insert mime %q: %w", mimeType, insertErr)
	}

	mime, err = s.Meta.queries.SelectMimeTypeByValue(ctx, mimeType)
	if err != nil {
		return 0, fmt.Errorf("reselect mime %q: %w", mimeType, err)
	}

	return mime.ID, nil
}
