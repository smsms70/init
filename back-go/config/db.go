package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {

	var err error
	DB, err = sql.Open("sqlite3", "./foo.db")

	fmt.Println("db connected")

	if err != nil {
		log.Fatal(err)
	}

	DB.SetMaxOpenConns(1)
	DB.SetMaxIdleConns(1)
}
