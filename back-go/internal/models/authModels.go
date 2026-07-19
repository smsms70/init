package model

// import (
// 	"context"
//
// 	"example.com/backend/config"
// )

//
// type User struct {
// 	Name, Password, Email string
// }
//
// func SaveUser(user User) error {
// 	_, err := config.DB.Query(context.Background(), "insert into users (name, email, password) values ($1, $2, $3);", user.Name, user.Email, user.Password)
//
// 	return err
// }
//
// func CheckByName(user User) ([]User, error) {
// 	rows, err := config.DB.Query(context.Background(), "select from users (name, password) where name = $1 & password = $2;", user.Name, user.Password)
//
// 	var users []User
// 	for rows.Next() {
// 		var user, password string
// 		err := rows.Scan(&user, &password)
//
// 		if err != nil {
// 			return users, err
// 		}
// 		users = append(users, User{Name: user, Password: password})
// 	}
//
// 	return users, err
// }
