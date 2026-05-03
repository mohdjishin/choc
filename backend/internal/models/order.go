package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "PENDING"
	OrderStatusApproved  OrderStatus = "APPROVED"
	OrderStatusDelivered OrderStatus = "DELIVERED"
	OrderStatusCanceled  OrderStatus = "CANCELED"
)

type OrderItem struct {
	ProductID primitive.ObjectID `bson:"product_id" json:"product_id"`
	Name      string             `bson:"name" json:"name"`
	Quantity  int                `bson:"quantity" json:"quantity"`
	Price     float64            `bson:"price" json:"price"`
	Image     string             `bson:"image" json:"image"`
}

type Order struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	UserEmail   string             `bson:"user_email" json:"user_email"`
	Items       []OrderItem        `bson:"items" json:"items"`
	TotalAmount float64            `bson:"total_amount" json:"total_amount"`
	Status       OrderStatus        `bson:"status" json:"status"`
	CancelReason string             `bson:"cancel_reason,omitempty" json:"cancel_reason,omitempty"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}
