package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/config"
	"github.com/muhammedjishinjamal/choc/backend/internal/db"
	"github.com/muhammedjishinjamal/choc/backend/internal/middleware"
	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"github.com/muhammedjishinjamal/choc/backend/internal/utils"
	"github.com/rs/zerolog"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CartHandler struct {
	DB     *db.MongoClient
	Config *config.Config
	Logger zerolog.Logger
}

func (h *CartHandler) GetCart(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.Claims)
	if !ok {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	collection := h.DB.Database.Collection("carts")
	var cart models.Cart
	err := collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			utils.JSONResponse(w, http.StatusOK, models.Cart{UserID: userID, Items: []models.CartItem{}})
			return
		}
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error fetching cart")
		return
	}

	utils.JSONResponse(w, http.StatusOK, cart)
}

func (h *CartHandler) UpdateCart(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.Claims)
	if !ok {
		utils.ErrorResponse(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	var req struct {
		Items []models.CartItem `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	collection := h.DB.Database.Collection("carts")
	filter := bson.M{"user_id": userID}
	update := bson.M{
		"$set": bson.M{
			"items":      req.Items,
			"updated_at": primitive.NewDateTimeFromTime(time.Now()),
		},
	}
	opts := options.Update().SetUpsert(true)

	_, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Error updating cart")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Cart updated successfully"})
}
