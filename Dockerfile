# first stage - frontend react - bun 
FROM oven/bun:1 AS frontend-build
WORKDIR /app/front-web

COPY ./front-web/package*.json ./

RUN bun install 

COPY ./front-web/ ./

RUN bun run build

#second stage - backend go
FROM golang:1.26.4-alpine3.23 AS backend-build
RUN apk add --no-cache gcc musl-dev
ENV CGO_ENABLED=1

WORKDIR /app/backend
COPY ./back-go/go.mod ./back-go/go.sum ./backend
# RUN go install github.com/air-verse/air@latest
RUN cd backend && go mod download
COPY back-go/ ./backend/
COPY --from=frontend-build /app/front/dist ./back/frontend/dist
RUN go build -v -o /app ./...
CMD ["app"]
# CMD ["air"]

#final stage
FROM alpine:3.19
# RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=backend-build /app/server .
# The database file will be created at ./data.db, mount a volume to persist it
VOLUME ["/app/data"]
ENV DB_PATH=/app/data/data.db
EXPOSE 8080
CMD ["./server"]

