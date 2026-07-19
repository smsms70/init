FROM golang:1.26.4-alpine3.23

WORKDIR /app

RUN go install github.com/air-verse/air@latest

RUN apk add --no-cache gcc musl-dev
ENV CGO_ENABLED=1

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air"]

