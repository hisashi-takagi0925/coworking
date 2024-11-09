FROM golang:1.23.2-alpine

WORKDIR /app

COPY . .

RUN go build -o main ./cmd/server

EXPOSE 8080

CMD ["./main"]
