package main

import (
	modelsProduct "coworking-api/infraStructure/models/Product"
	modelsUser "coworking-api/infraStructure/models/User"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/hello", HelloHandler).Methods("GET")

	fmt.Println("Server is running on port 8080")

	dsn := "host=localhost user=myuser password=mypassword dbname=mydatabase port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// 新しいテーブルを含むマイグレーションの実行
	err = db.AutoMigrate(&modelsUser.User{}, &modelsProduct.Product{})
	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}

	log.Println("Database migrated successfully")

	// CORSミドルウェアを使用
	handler := cors.Default().Handler(r)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Hello, World!"))
} 