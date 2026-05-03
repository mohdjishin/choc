package utils

import (
	"fmt"
	"log"
	"mime/multipart"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/muhammedjishinjamal/choc/backend/internal/config"
)

type S3Uploader struct {
	Config *config.Config
}

func (u *S3Uploader) UploadFile(file multipart.File, filename string) (string, error) {
	creds := credentials.NewStaticCredentials(u.Config.AWSAccessKey, u.Config.AWSSecretKey, "")
	cfg := aws.NewConfig().WithRegion(u.Config.AWSRegion).WithCredentials(creds)

	sess, err := session.NewSession(cfg)
	if err != nil {
		log.Printf("Failed to create S3 session: %v", err)
		return "", fmt.Errorf("failed to create session: %v", err)
	}

	uploader := s3manager.NewUploader(sess)

	key := fmt.Sprintf("products/%s", filename)
	log.Printf("Starting S3 upload: bucket=%s, key=%s, region=%s", u.Config.AWSBucket, key, u.Config.AWSRegion)
	
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(u.Config.AWSBucket),
		Key:    aws.String(key),
		Body:   file,
	})

	if err != nil {
		log.Printf("S3 Upload Error: %v", err)
		return "", fmt.Errorf("failed to upload file to S3 (%s): %v", u.Config.AWSBucket, err)
	}

	finalURL := result.Location
	if u.Config.CDNURL != "" {
		finalURL = fmt.Sprintf("%s/%s", u.Config.CDNURL, key)
		log.Printf("Using CDN URL: %s", finalURL)
	}

	log.Printf("S3 upload successful. URL: %s", finalURL)
	return finalURL, nil
}

func (u *S3Uploader) DeleteFile(fileURL string) error {
	// Simple extraction: get everything after the last slash if it's a full URL
	key := fileURL
	if len(fileURL) > 8 && (fileURL[:8] == "https://" || fileURL[:7] == "http://") {
		parts := strings.Split(fileURL, "/")
		key = parts[len(parts)-1]
	}

	creds := credentials.NewStaticCredentials(u.Config.AWSAccessKey, u.Config.AWSSecretKey, "")
	cfg := aws.NewConfig().WithRegion(u.Config.AWSRegion).WithCredentials(creds)

	sess, err := session.NewSession(cfg)
	if err != nil {
		return fmt.Errorf("failed to create session: %v", err)
	}

	svc := s3.New(sess)
	_, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(u.Config.AWSBucket),
		Key:    aws.String(key),
	})

	if err != nil {
		log.Printf("S3 Delete Error: %v", err)
		return fmt.Errorf("failed to delete file from s3: %v", err)
	}

	return nil
}
