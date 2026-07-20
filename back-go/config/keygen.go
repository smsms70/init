package config

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
)

func GenKey() []byte {

	secret := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, secret); err != nil {
		fmt.Println("error is: ", err)
	}
	hexSecret := []byte(hex.EncodeToString(secret))

	return hexSecret
}
