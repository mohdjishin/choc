package config

import (
	"encoding/json"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string `json:"port"`
	AllowedOrigins string `json:"allowed_origins"`
	MongoURI       string `json:"mongo_uri"`
	DBName         string `json:"db_name"`
	JWTSecret      string `json:"jwt_secret"`
	AWSRegion      string `json:"aws_region"`
	AWSBucket      string `json:"aws_bucket"`
	AWSAccessKey   string `json:"aws_access_key"`
	AWSSecretKey   string `json:"aws_secret_key"`
	CDNURL         string `json:"cdn_url"`
}

func Load() *Config {
	// 1. Set Defaults
	cfg := &Config{
		Port:           "8081",
		AllowedOrigins: "http://localhost:3000,http://localhost:5173",
		MongoURI:       "mongodb://localhost:27017",
		DBName:         "choc_db",
		JWTSecret:      "super-secret-key",
		AWSRegion:      "us-east-1",
		AWSBucket:      "choc-media",
		AWSAccessKey:   "test",
		AWSSecretKey:   "test",
		CDNURL:         "http://localhost:4566",
	}

	// 2. Try loading from .env for local development
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using other sources")
	}

	// 3. Try loading from config.json if it exists
	if file, err := os.Open("config.json"); err == nil {
		defer file.Close()
		if err := json.NewDecoder(file).Decode(cfg); err != nil {
			log.Println("Warning: Failed to decode config.json:", err)
		} else {
			log.Println("Successfully loaded configuration from config.json")
		}
	}

	// 4. Override with Environment Variables
	cfg.Port = getEnv("PORT", cfg.Port)
	cfg.AllowedOrigins = getEnv("CORS_ALLOWED_ORIGINS", cfg.AllowedOrigins)
	cfg.MongoURI = getEnv("MONGO_URI", cfg.MongoURI)
	cfg.DBName = getEnv("DB_NAME", cfg.DBName)
	cfg.JWTSecret = getEnv("JWT_SECRET", cfg.JWTSecret)
	cfg.AWSRegion = getEnv("AWS_REGION", cfg.AWSRegion)
	cfg.AWSBucket = getEnv("S3_BUCKET_NAME", cfg.AWSBucket)
	cfg.AWSAccessKey = getEnv("AWS_ACCESS_KEY_ID", cfg.AWSAccessKey)
	cfg.AWSSecretKey = getEnv("AWS_SECRET_ACCESS_KEY", cfg.AWSSecretKey)
	cfg.CDNURL = getEnv("S3_ENDPOINT", cfg.CDNURL)

	return cfg
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
