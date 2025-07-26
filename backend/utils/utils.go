package utils

import (
	"database/sql"
	"time"
)

func FormatTime(nt sql.NullTime) string {
	if nt.Valid {
		return nt.Time.Format(time.RFC3339) // or your preferred format
	}
	return ""
}

func BoolToNullInt64(b bool) sql.NullInt64 {
	if b {
		return sql.NullInt64{Int64: 1, Valid: true}
	}
	return sql.NullInt64{Int64: 0, Valid: true}
}
