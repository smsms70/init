package controllers

import (
	"errors"
	"fmt"

	"net/http"
	"time"

	"example.com/backend/config"
	"github.com/gin-gonic/gin"

	"github.com/golang-jwt/jwt/v5"
	"os"
)

var jwtSecret []byte = config.GenKey()
var refreshTokenSecret []byte = config.GenKey()

type User struct {
	Username *string `json:"username" binding:"required"`
	Password *string `json:"password" binding:"required"`
}
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}
type Token struct {
	Token          string
	RefreshToken   string
	ExpirationTime time.Time
}
type ExpirationT struct {
	accessToken, refreshToken time.Duration
}

var Expiration = ExpirationT{
	accessToken:  time.Minute * 10,   //15 min
	refreshToken: time.Hour * 24 * 7, // 7 days
}

type UserName struct {
	Name *string `json:"username" binding:"required"`
}

// refresh token ROUTE
func RefreshToken(c *gin.Context) {
	var body UserName

	//verify body request
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "not corrent argument"})
		return
	}
	//get cookie
	cookie, err := c.Cookie("refresh_token_id")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no refresh cookie"})
		return
	}
	//verify cookie
	if err := verifyCookie(cookie, refreshTokenSecret); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	//get token
	tokenString, err := accessToken(*body.Name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessDuration := int(Expiration.accessToken * 10000)
	c.SetCookie("token_id", tokenString, accessDuration, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": tokenString})
}

// middleware ROUTE
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// authHeader := c.GetHeader("Authorization")
		cookie, err := c.Cookie("token_id")
		if err != nil {
			fmt.Println("cookie error: ", err.Error())
			c.JSON(http.StatusUnauthorized, gin.H{"error": "StatusUnauthorized"})
			return
		}
		// fmt.Println("cookie: ", cookie)
		if err := verifyCookie(cookie, jwtSecret); err != nil {
			fmt.Println("error is: ", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.Next()
	}
}

// Login ROUTE
func Login(c *gin.Context) {
	var body User

	//verify body request
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusMethodNotAllowed, gin.H{"message": "not corrent argument"})
		return
	}

	//confirm user and get token
	token, err := ConfirmUser(body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	//set cookies with tokens
	accessDuration := int(Expiration.accessToken * 10000)
	refreshDuration := int(Expiration.refreshToken * 10000)
	c.SetCookie("token_id", token.Token, accessDuration, "/", "", false, true)
	c.SetCookie("refresh_token_id", token.RefreshToken, refreshDuration, "/", "", false, true)

	//return tokens
	c.JSON(http.StatusOK, gin.H{
		"token":   token.Token,
		"expires": token.ExpirationTime,
	})
}

// modelLogin
// confirm user and get tokens handler
func ConfirmUser(user User) (*Token, error) {
	storedPassword := os.Getenv("ADMIN_PASSWORD")
	storedUser := os.Getenv("ADMIN_USER")

	if storedPassword != *user.Password {
		fmt.Println("incorrent password")
		return nil, errors.New("incorrenct password")
	}

	if storedUser != *user.Username {
		return nil, errors.New("incorrect user")
	}

	//get Access Token
	accessTokenString, err := accessToken(*user.Username)
	if err != nil {
		return nil, errors.New("could not generate token")
	}

	//get Refresh Token
	refreshTokenString, err := refreshToken(user)
	if err != nil {
		return nil, errors.New("can't generate refresh accessToken")
	}

	return &Token{Token: accessTokenString, RefreshToken: refreshTokenString}, nil
}

// verify cookie handler
func verifyCookie(cookieString string, jwtSecret []byte) error {

	token, err := jwt.Parse(cookieString, func(token *jwt.Token) (any, error) {
		// Ensure the signing algorithm is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		fmt.Println("error token is:", err)
		fmt.Println(token.Method)
		fmt.Println(token.Header["alg"])
		return errors.New("Invalid or expired token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check expiration manually (though Parse does this automatically)
		if exp, ok := claims["exp"].(float64); ok {
			if int64(exp) < time.Now().Unix() {
				return errors.New("Token expired")
			}
		}
		// c.Set("username", claims["sub"]) // Store for downstream handlers
	} else {
		return errors.New("Invalid claims")
	}
	return nil
}

// Get access token handler
func accessToken(username string) (string, error) {
	accessClaims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(Expiration.accessToken)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	tokenString, err := token.SignedString(jwtSecret)

	return tokenString, err
}

// Get refresh token handler
func refreshToken(user User) (string, error) {
	refreshClaims := &Claims{
		Username: *user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(Expiration.refreshToken)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := token.SignedString(refreshTokenSecret)

	return refreshTokenString, err
}
