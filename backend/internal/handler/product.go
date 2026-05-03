package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/config"
	"github.com/muhammedjishinjamal/choc/backend/internal/db"
	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"github.com/muhammedjishinjamal/choc/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductHandler struct {
	DB     *db.MongoClient
	Config *config.Config
}

func (h *ProductHandler) UploadMedia(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // 10MB limit
	if err != nil {
		http.Error(w, "File too large", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	uploader := &utils.S3Uploader{Config: h.Config}
	location, err := uploader.UploadFile(file, header.Filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"url": location})
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	product.ID = primitive.NewObjectID()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	collection := h.DB.Database.Collection("products")
	_, err := collection.InsertOne(ctx, product)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to create product")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, product)
}

func (h *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	collection := h.DB.Database.Collection("products")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to fetch products")
		return
	}
	defer cursor.Close(ctx)

	products := []models.Product{}
	if err := cursor.All(ctx, &products); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to decode products")
		return
	}

	utils.JSONResponse(w, http.StatusOK, products)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		http.Error(w, "Invalid Product ID", http.StatusBadRequest)
		return
	}

	var newProduct models.Product
	if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	collection := h.DB.Database.Collection("products")
	
	// Orphan Cleanup Logic
	var oldProduct models.Product
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&oldProduct)
	if err == nil {
		uploader := &utils.S3Uploader{Config: h.Config}
		oldMedia := append(oldProduct.Images, oldProduct.Videos...)
		newMedia := append(newProduct.Images, newProduct.Videos...)
		
		// Create a map for fast lookup
		newMediaMap := make(map[string]bool)
		for _, url := range newMedia {
			newMediaMap[url] = true
		}

		// Delete if in old but not in new
		for _, url := range oldMedia {
			if url != "" && !newMediaMap[url] {
				uploader.DeleteFile(url)
			}
		}
	}

	newProduct.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"name":          newProduct.Name,
			"price":         newProduct.Price,
			"category":      newProduct.Category,
			"stock":         newProduct.Stock,
			"description":   newProduct.Description,
			"images":        newProduct.Images,
			"videos":        newProduct.Videos,
			"details":       newProduct.Details,
			"origins_craft": newProduct.OriginsCraft,
			"updated_at":    newProduct.UpdatedAt,
		},
	}

	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		http.Error(w, "Invalid Product ID", http.StatusBadRequest)
		return
	}

	collection := h.DB.Database.Collection("products")
	
	// Find product first to get media URLs
	var product models.Product
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)
	if err == nil {
		// Clean up S3 assets
		uploader := &utils.S3Uploader{Config: h.Config}
		allMedia := append(product.Images, product.Videos...)
		for _, url := range allMedia {
			if url != "" {
				uploader.DeleteFile(url)
			}
		}
	}

	// Delete from DB
	_, err = collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
