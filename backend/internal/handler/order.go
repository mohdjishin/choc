package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/muhammedjishinjamal/choc/backend/internal/config"
	"github.com/muhammedjishinjamal/choc/backend/internal/db"
	"github.com/muhammedjishinjamal/choc/backend/internal/middleware"
	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"github.com/muhammedjishinjamal/choc/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OrderHandler struct {
	DB     *db.MongoClient
	Config *config.Config
}

func (h *OrderHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.Claims)
	if !ok {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	var order models.Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	order.ID = primitive.NewObjectID()
	order.UserID = userID
	order.UserEmail = claims.Email
	order.Status = models.OrderStatusPending
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	_, err := h.DB.Database.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error creating order")
		return
	}

	// Clear cart after successful order
	h.DB.Database.Collection("carts").DeleteOne(ctx, bson.M{"user_id": userID})

	utils.JSONResponse(w, http.StatusCreated, order)
}

func (h *OrderHandler) ListUserOrders(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.Claims)
	if !ok {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := h.DB.Database.Collection("orders").Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error fetching orders")
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error decoding orders")
		return
	}

	utils.JSONResponse(w, http.StatusOK, orders)
}

func (h *OrderHandler) ListAllOrders(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := h.DB.Database.Collection("orders").Find(ctx, bson.M{}, opts)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error fetching all orders")
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error decoding all orders")
		return
	}

	utils.JSONResponse(w, http.StatusOK, orders)
}

func (h *OrderHandler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	orderIDHex := chi.URLParam(r, "id")
	orderID, err := primitive.ObjectIDFromHex(orderIDHex)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var req struct {
		Status       models.OrderStatus `json:"status"`
		CancelReason string             `json:"cancel_reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// Fetch current order to check status
	var currentOrder models.Order
	err = h.DB.Database.Collection("orders").FindOne(ctx, bson.M{"_id": orderID}).Decode(&currentOrder)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Order not found")
		return
	}

	// 1. Enforce Approval before Delivery
	if req.Status == models.OrderStatusDelivered && currentOrder.Status != models.OrderStatusApproved {
		utils.ErrorResponse(w, http.StatusBadRequest, "Order must be APPROVED before it can be DELIVERED")
		return
	}

	// 2. Enforce Reason for Cancellation after Approval
	if req.Status == models.OrderStatusCanceled && currentOrder.Status == models.OrderStatusApproved && req.CancelReason == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "A reason is required for canceling an APPROVED order")
		return
	}

	// 3. Prevent updates from terminal states (CANCELED, DELIVERED)
	if currentOrder.Status == models.OrderStatusCanceled || currentOrder.Status == models.OrderStatusDelivered {
		utils.ErrorResponse(w, http.StatusBadRequest, "Cannot update the status of a CANCELED or DELIVERED order")
		return
	}

	filter := bson.M{"_id": orderID}
	update := bson.M{
		"$set": bson.M{
			"status":        req.Status,
			"cancel_reason": req.CancelReason,
			"updated_at":    time.Now(),
		},
	}

	_, err = h.DB.Database.Collection("orders").UpdateOne(ctx, filter, update)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error updating order status")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Order status updated"})
}
