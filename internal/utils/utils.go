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
