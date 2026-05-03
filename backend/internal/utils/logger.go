package utils

import (
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func InitLogger() {
	// UNIX Time is faster and smaller than most timestamps
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	
	// Create a console writer for pretty logging in development
	// For production, you might want to use raw JSON to stdout
	output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}
	
	log.Logger = zerolog.New(output).With().Timestamp().Logger()
}
