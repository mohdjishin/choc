package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductDetail struct {
	Title   string `bson:"title" json:"title"`
	Content string `bson:"content" json:"content"`
}

type CraftBlock struct {
	Type    string `bson:"type" json:"type"` // e.g., "wide-image", "text-card", "square-image"
	Title   string `bson:"title" json:"title"`
	Content string `bson:"content" json:"content"`
	Image   string `bson:"image" json:"image"`
	Tag     string `bson:"tag" json:"tag"`
}

type Product struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name"`
	Description  string             `bson:"description" json:"description"`
	Price        float64            `bson:"price" json:"price"`
	Category     string             `bson:"category" json:"category"`
	Stock        int                `bson:"stock" json:"stock"`
	Images       []string           `bson:"images" json:"images"`
	Videos       []string           `bson:"videos" json:"videos"`
	Details      []ProductDetail    `bson:"details" json:"details"`
	OriginsCraft []CraftBlock       `bson:"origins_craft" json:"origins_craft"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}
