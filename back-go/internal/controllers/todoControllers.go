package controllers

import (
	"fmt"
	"net/http"

	todoModels "example.com/backend/internal/models"
	"github.com/gin-gonic/gin"
)

func CreateTable(c *gin.Context) {
	err := todoModels.CreateTableNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "table created"})
}

func GetParentNodes(c *gin.Context) {
	rows, err := todoModels.GetParentNodes()
	fmt.Println("happend")
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		fmt.Println("error is: ", err)
		fmt.Println("error is: ", err.Error())
		return
	}
	c.JSON(200, gin.H{"rows": rows})
}

func GetNodes(c *gin.Context) {
	param := c.Param("parent_id")

	rows, err := todoModels.GetNodes(param)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"rows": rows})
}

func GetNodeName(c *gin.Context) {
	id := c.Param("id")
	rows, err := todoModels.GetNodeName(id)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"rows": rows})
}
func AddNode(c *gin.Context) {
	var paramId = c.Param("parent_id")
	var body todoModels.AddNodeType

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	LastInsertId, err := todoModels.AddNode(paramId, body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": LastInsertId})
}

type ParentNodeStruct struct {
	Data string `json:"data" binding:"required"`
}

func AddParentNode(c *gin.Context) {
	var body ParentNodeStruct

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	lastId, err := todoModels.AddParentNode(body.Data)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"id": lastId})

}

func UpdateNode(c *gin.Context) {
	var paramId = c.Param("parent_id")

	var body todoModels.UpdatedNode
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("body:", body)
	if err := todoModels.PartialNodeUpdate(paramId, body); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "updated"})
}

func NormalizeOrden(c *gin.Context) {
	var body todoModels.OrdenNormalizeT
	fmt.Println("something: ", body)
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(body)
	err := todoModels.NormalizeOrden(body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "updated"})
}

func DeleteNode(c *gin.Context) {
	id := c.Param("id")

	fmt.Println(id)
	if err := todoModels.DeleteNode(id); err != nil {
		c.JSON(500, gin.H{"error": err})
		return
	}
	c.JSON(200, gin.H{"message": "deleted!"})
}
