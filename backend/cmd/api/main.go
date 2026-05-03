package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/config"
	"github.com/muhammedjishinjamal/choc/backend/internal/db"
	"github.com/muhammedjishinjamal/choc/backend/internal/handler"
	"github.com/muhammedjishinjamal/choc/backend/internal/router"
	"github.com/muhammedjishinjamal/choc/backend/internal/utils"
)

func main() {
	// 0. Initialize Logger
	utils.InitLogger()
	logger := slog.Default()

	// 1. Load Configuration
	cfg := config.Load()

	// 2. Connect to MongoDB
	mongoClient, err := db.Connect(cfg.MongoURI, cfg.DBName)
	if err != nil {
		logger.Warn("Could not connect to MongoDB, proceeding without DB", "error", err)
	} else {
		logger.Info("Connected to MongoDB successfully")
		
		// 3. Seed Default Users
		if err := db.SeedDefaultUsers(mongoClient); err != nil {
			logger.Error("Failed to seed default users", "error", err)
			os.Exit(1)
		}
		if err := db.SeedProducts(mongoClient); err != nil {
			logger.Error("Failed to seed products", "error", err)
			os.Exit(1)
		}
		
		defer mongoClient.Close()
	}

	// 3. Initialize Handlers
	authHandler := &handler.AuthHandler{
		DB:     mongoClient,
		Config: cfg,
	}
	productHandler := &handler.ProductHandler{
		DB:     mongoClient,
		Config: cfg,
	}

	// 4. Initialize Router
	r := router.New(authHandler, productHandler)

	// 4. Start Server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful Shutdown Channel
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		logger.Info("Server is starting", "port", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Could not listen", "port", cfg.Port, "error", err)
			os.Exit(1)
		}
	}()

	<-done
	logger.Info("Server is shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown", "error", err)
		os.Exit(1)
	}

	logger.Info("Server exited gracefully")
}
