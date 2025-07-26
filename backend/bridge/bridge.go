// backend/bridge/bridge.go

package bridge

import (
	"mediamanager/backend"
)

type Bridge struct {
	backend *backend.Service
}

func New(backend *backend.Service) *Bridge {
	return &Bridge{backend: backend}
}

func (b *Bridge) GetTags(imageID int) []string {
	return []string{}
}
