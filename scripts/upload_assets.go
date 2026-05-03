package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

type Config struct {
	Port           string `json:"port"`
	MongoURI       string `json:"mongo_uri"`
	DBName         string `json:"db_name"`
	AWSRegion      string `json:"aws_region"`
	S3BucketName   string `json:"s3_bucket_name"`
	AWSAccessKey   string `json:"aws_access_key"`
	AWSSecretKey   string `json:"aws_secret_key"`
	S3Endpoint     string `json:"s3_endpoint"`
}

func main() {
	// 1. Load configuration
	configPath := filepath.Join("..", "backend", "config.json")
	configData, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	var config Config
	if err := json.Unmarshal(configData, &config); err != nil {
		log.Fatalf("Failed to unmarshal config: %v", err)
	}

	// 2. Setup AWS Session
	awsConfig := &aws.Config{
		Region:           aws.String(config.AWSRegion),
		Credentials:      credentials.NewStaticCredentials(config.AWSAccessKey, config.AWSSecretKey, ""),
	}

	// If endpoint is not CloudFront, use it as S3 endpoint
	endpointURL := config.S3Endpoint
	if endpointURL != "" && !strings.Contains(endpointURL, "cloudfront") {
		awsConfig.Endpoint = aws.String(endpointURL)
		awsConfig.S3ForcePathStyle = aws.Bool(true)
	}

	sess, err := session.NewSession(awsConfig)
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
	}

	uploader := s3manager.NewUploader(sess)

	// 3. Prepare assets directory
	assetsDir := filepath.Join("..", "backend", "public", "seed_assets")
	files, err := ioutil.ReadDir(assetsDir)
	if err != nil {
		log.Fatalf("Failed to read assets directory: %v", err)
	}

	results := make(map[string]string)
	fmt.Printf("Uploading assets from %s to bucket %s...\n", assetsDir, config.S3BucketName)

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filePath := filepath.Join(assetsDir, file.Name())
		key := fmt.Sprintf("seed_assets/%s", file.Name())

		// Determine Content-Type
		contentType := "image/png"
		ext := strings.ToLower(filepath.Ext(file.Name()))
		if ext == ".jpg" || ext == ".jpeg" {
			contentType = "image/jpeg"
		}

		f, err := os.Open(filePath)
		if err != nil {
			log.Printf("Failed to open file %s: %v", file.Name(), err)
			continue
		}

		_, err = uploader.Upload(&s3manager.UploadInput{
			Bucket:      aws.String(config.S3BucketName),
			Key:         aws.String(key),
			Body:        f,
			ContentType: aws.String(contentType),
		})
		f.Close()

		if err != nil {
			log.Printf("Failed to upload %s: %v", file.Name(), err)
			continue
		}

		// 4. Generate URL
		var url string
		if awsConfig.Endpoint != nil {
			url = fmt.Sprintf("%s/%s/%s", *awsConfig.Endpoint, config.S3BucketName, key)
		} else {
			url = fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", config.S3BucketName, config.AWSRegion, key)
		}

		results[file.Name()] = url
		fmt.Printf("Uploaded %s -> %s\n", file.Name(), url)
	}

	// 5. Save results
	resultsJSON, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal results: %v", err)
	}

	if err := ioutil.WriteFile("upload_results.json", resultsJSON, 0644); err != nil {
		log.Fatalf("Failed to save results: %v", err)
	}

	fmt.Println("Upload completed successfully. Results saved to upload_results.json")
}
