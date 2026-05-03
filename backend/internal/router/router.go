package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/muhammedjishinjamal/choc/backend/internal/handler"
	customMiddleware "github.com/muhammedjishinjamal/choc/backend/internal/middleware"
	"github.com/muhammedjishinjamal/choc/backend/internal/models"
)

func New(authHandler *handler.AuthHandler, productHandler *handler.ProductHandler) *chi.Mux {
	r := chi.NewRouter()

	// CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Global Middlewares
	r.Use(middleware.Logger)    // Log every request
	r.Use(middleware.Recoverer) // Recover from panics
	r.Use(middleware.CleanPath) // Clean trailing slashes
	r.Use(middleware.RealIP)    // Get client real IP
	r.Use(middleware.NoCache)   // Disable caching for API responses
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("X-Content-Type-Options", "nosniff")
			w.Header().Set("X-Frame-Options", "DENY")
			w.Header().Set("X-XSS-Protection", "1; mode=block")
			next.ServeHTTP(w, r)
		})
	})

	// Public Routes
	r.Get("/health", handler.HealthCheck)
	r.Post("/auth/register", authHandler.Register)
	r.Post("/auth/login", authHandler.Login)
	r.Get("/products", productHandler.ListProducts)

	// Protected Routes
	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware(authHandler.Config.JWTSecret))

		// Admin/Super Admin only routes
		r.Group(func(r chi.Router) {
			r.Use(customMiddleware.RoleMiddleware(models.RoleAdmin, models.RoleSuperAdmin))
			r.Post("/products", productHandler.CreateProduct)
			r.Put("/products", productHandler.UpdateProduct)
			r.Delete("/products", productHandler.DeleteProduct)
			r.Post("/products/upload", productHandler.UploadMedia)
			r.Get("/admin/dashboard", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("Welcome to the Admin Dashboard"))
			})
		})

		// Super Admin only routes
		r.Group(func(r chi.Router) {
			r.Use(customMiddleware.RoleMiddleware(models.RoleSuperAdmin))
			r.Get("/superadmin/settings", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("Welcome to Super Admin Settings"))
			})
		})

		// Customer routes
		r.Group(func(r chi.Router) {
			r.Use(customMiddleware.RoleMiddleware(models.RoleCustomer, models.RoleAdmin, models.RoleSuperAdmin))
			r.Get("/profile", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("Welcome to your Profile"))
			})
		})
	})

	// Serve static files
	fs := http.FileServer(http.Dir("./public"))
	r.Handle("/public/*", http.StripPrefix("/public/", fs))

	return r
}
