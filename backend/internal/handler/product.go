package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/config"
	"github.com/muhammedjishinjamal/choc/backend/internal/db"
	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"github.com/muhammedjishinjamal/choc/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	// Get pagination, filter, and sort parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	stockOnly := r.URL.Query().Get("stock") == "true"

	page := 1
	limit := 12 // Default limit

	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	collection := h.DB.Database.Collection("products")

	// Build filter
	filter := bson.M{}
	if category != "" && category != "All" {
		filter["category"] = category
	}
	if stockOnly {
		filter["stock"] = bson.M{"$gt": 0}
	}
	if r.URL.Query().Get("selected") == "true" {
		filter["is_selected"] = true
	}

	// Count total products for metadata
	totalCount, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, "Failed to count products")
		return
	}

	// Build Sort
	sortBson := bson.M{"created_at": -1} // Default newest
	switch sort {
	case "price_asc":
		sortBson = bson.M{"price": 1}
	case "price_desc":
		sortBson = bson.M{"price": -1}
	case "oldest":
		sortBson = bson.M{"created_at": 1}
	}

	// Find with pagination
	skip := (page - 1) * limit
	findOptions := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(sortBson)

	cursor, err := collection.Find(ctx, filter, findOptions)
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

	response := map[string]interface{}{
		"products": products,
		"metadata": map[string]interface{}{
			"current_page": page,
			"limit":        limit,
			"total_count":  totalCount,
			"total_pages":  (int(totalCount) + limit - 1) / limit,
		},
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		utils.ErrorResponse(w, http.StatusBadRequest, "Product ID is required")
		return
	}

	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, "Invalid Product ID")
		return
	}

	collection := h.DB.Database.Collection("products")
	var product models.Product
	err = collection.FindOne(r.Context(), bson.M{"_id": id}).Decode(&product)
	if err != nil {
		utils.ErrorResponse(w, http.StatusNotFound, "Product not found")
		return
	}

	// Fetch next and previous product IDs for pagination
	var prevProduct, nextProduct models.Product
	
	// Previous: Newest product created before this one
	collection.FindOne(r.Context(), bson.M{"created_at": bson.M{"$lt": product.CreatedAt}}, options.FindOne().SetSort(bson.M{"created_at": -1})).Decode(&prevProduct)
	
	// Next: Oldest product created after this one
	collection.FindOne(r.Context(), bson.M{"created_at": bson.M{"$gt": product.CreatedAt}}, options.FindOne().SetSort(bson.M{"created_at": 1})).Decode(&nextProduct)

	response := map[string]interface{}{
		"product": product,
		"navigation": map[string]interface{}{
			"prev_id": prevProduct.ID.Hex(),
			"next_id": nextProduct.ID.Hex(),
		},
	}
	if prevProduct.ID.IsZero() { response["navigation"].(map[string]interface{})["prev_id"] = nil }
	if nextProduct.ID.IsZero() { response["navigation"].(map[string]interface{})["next_id"] = nil }

	utils.JSONResponse(w, http.StatusOK, response)
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
			"is_selected":   newProduct.IsSelected,
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
