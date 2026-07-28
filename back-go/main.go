package main

import (
	"os"
	"strings"
	"time"

	"example.com/backend/config"
	"example.com/backend/internal/models"
	"example.com/backend/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	config.InitDB()

	_, exists := os.LookupEnv("DEV")
	if !exists {
		router.Static("/assets", "./frontend/dist/assets")
		router.NoRoute(func(c *gin.Context) {
			c.File("./frontend/dist/index.html")
		})
	}

	router.Use(cors.New(cors.Config{
		// AllowOrigins: []string{"http://localhost:5173"}, // Specific origins
		// AllowAllOrigins: true,
		AllowOriginFunc: func(origin string) bool {
			if strings.HasPrefix(origin, "http://localhost:") ||
				strings.HasPrefix(origin, "http://127.0.0.1") {
				return true
			}
			if strings.HasPrefix(origin, "http://192.168") ||
				strings.HasPrefix(origin, "http://10.") ||
				strings.HasPrefix(origin, "http://172.") {
				return true
			}
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	defer config.DB.Close()

	model.CreateTableNode()
	r := router.Group("/api/v1")

	routes.TodoRoutes(r)
	router.Run()
}
