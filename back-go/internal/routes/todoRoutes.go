package routes

import (
	"example.com/backend/internal/controllers"
	"github.com/gin-gonic/gin"
)

func TodoRoutes(routes *gin.RouterGroup) {
	nodes := routes.Group("/nodes")
	nodes.Use(controllers.AuthMiddleware())
	{
		nodes.GET("/initTable", controllers.CreateTable)
		nodes.GET("/linkTargets", controllers.GetLinkTargets)
		nodes.GET("/incomingLinks/:id", controllers.GetIncomingLinks)
		nodes.GET("/:parent_id/nested", controllers.GetNestedParents)
		nodes.GET("/:parent_id", controllers.GetNodes)
		nodes.POST("/:parent_id", controllers.AddNode)
		nodes.PUT("/:parent_id", controllers.UpdateNode)
		nodes.PUT("/normalizeOrden", controllers.NormalizeOrden)
		nodes.DELETE("/:id", controllers.DeleteNode)
	}
	parentNode := routes.Group("/parent_node")
	parentNode.Use(controllers.AuthMiddleware())
	{
		parentNode.GET("/tree", controllers.GetParentTree)
		parentNode.GET("/", controllers.GetParentNodes)
		parentNode.GET("/root", controllers.GetRootNode)
		parentNode.PUT("/root", controllers.UpdateRootNode)
		parentNode.GET("/getName/:id", controllers.GetNodeName)
		parentNode.POST("/", controllers.AddParentNode)
	}
	auth := routes.Group("/auth")
	{
		auth.POST("/login", controllers.Login)
		auth.POST("/refresh", controllers.RefreshToken)
	}
}
