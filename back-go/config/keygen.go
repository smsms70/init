package config

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"os"
)

func GenKey() []byte {

	secret := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, secret); err != nil {
		fmt.Println("error is: ", err)
	}

	value, exist := os.LookupEnv("JWT_SECRET")
	if exist && len(value) > 0 {
		secret = []byte(value)
	}

	hexSecret := []byte(hex.EncodeToString(secret))
	return hexSecret
}
