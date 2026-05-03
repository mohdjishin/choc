package main

import (
	"context"
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
	"github.com/rs/zerolog/log"
)

func main() {
	// 0. Initialize Logger
	utils.InitLogger()
	logger := log.Logger

	// 1. Load Configuration
	cfg := config.Load()

	// 2. Connect to MongoDB
	mongoClient, err := db.Connect(cfg.MongoURI, cfg.DBName)
	if err != nil {
		logger.Warn().Err(err).Msg("Could not connect to MongoDB, proceeding without DB")
	} else {
		logger.Info().Msg("Connected to MongoDB successfully")
		
		// 3. Seed Default Users
		if err := db.SeedDefaultUsers(mongoClient); err != nil {
			logger.Error().Err(err).Msg("Failed to seed default users")
			os.Exit(1)
		}
		if err := db.SeedProducts(mongoClient); err != nil {
			logger.Error().Err(err).Msg("Failed to seed products")
			os.Exit(1)
		}
		
		defer mongoClient.Close()
	}

	// 3. Initialize Handlers
	authHandler := &handler.AuthHandler{
		DB:     mongoClient,
		Config: cfg,
		Logger: logger,
	}
	productHandler := &handler.ProductHandler{
		DB:     mongoClient,
		Config: cfg,
		Logger: logger,
	}
	cartHandler := &handler.CartHandler{
		DB:     mongoClient,
		Config: cfg,
		Logger: logger,
	}

	orderHandler := &handler.OrderHandler{
		DB:     mongoClient,
		Config: cfg,
		Logger: logger,
	}

	// 4. Initialize Router
	r := router.New(authHandler, productHandler, cartHandler, orderHandler)

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
		logger.Info().Str("port", cfg.Port).Msg("Server is starting")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error().Str("port", cfg.Port).Err(err).Msg("Could not listen")
			os.Exit(1)
		}
	}()

	<-done
	logger.Info().Msg("Server is shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Error().Err(err).Msg("Server forced to shutdown")
		os.Exit(1)
	}

	logger.Info().Msg("Server exited gracefully")
}
