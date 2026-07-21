package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {

	var err error

	dbPath, exist := os.LookupEnv("DB_PATH")
	if !exist || dbPath == "" {
		fmt.Println("happened")
		dbPath = "./data/foo-data.db"
	}
	DB, err = sql.Open("sqlite3", dbPath)

	fmt.Println("db connected")

	if err != nil {
		log.Fatal(err)
	}

	DB.SetMaxOpenConns(1)
	DB.SetMaxIdleConns(1)
}
