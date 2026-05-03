package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	MongoURI           string
	DBName             string
	JWTSecret          string
	AWSRegion          string
	AWSBucket          string
	AWSAccessKey       string
	AWSSecretKey       string
	CDNURL             string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		Port:         getEnv("PORT", "8081"),
		MongoURI:     getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DBName:       getEnv("DB_NAME", "choc_db"),
		JWTSecret:    getEnv("JWT_SECRET", "super-secret-key"),
		AWSRegion:    getEnv("AWS_REGION", "us-east-1"),
		AWSBucket:    getEnv("S3_BUCKET_NAME", "choc-media"),
		AWSAccessKey: getEnv("AWS_ACCESS_KEY_ID", "test"),
		AWSSecretKey: getEnv("AWS_SECRET_ACCESS_KEY", "test"),
		CDNURL:       getEnv("S3_ENDPOINT", "http://localhost:4566"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
