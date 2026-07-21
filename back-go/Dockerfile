# Stage 1 — Build frontend
FROM oven/bun:1 AS frontend-build
WORKDIR /app/front-web
COPY ./front-web/package*.json ./front-web/bun.lock ./
RUN bun install
COPY ./front-web/ ./
RUN bun run build

# Stage 2 — Build Go backend
FROM golang:1.26.4-alpine3.23 AS backend-build
RUN apk add --no-cache gcc musl-dev git
ENV CGO_ENABLED=1
WORKDIR /app/backend
COPY ./back-go/go.mod ./back-go/go.sum ./
RUN go mod download
COPY ./back-go/ ./
COPY --from=frontend-build /app/front-web/dist ./frontend/dist
RUN go build -v -o /app/server .

# Stage 3 — Runtime
FROM alpine:3.19
WORKDIR /app
COPY --from=backend-build /app/server .
COPY --from=backend-build /app/backend/frontend/dist ./frontend/dist
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/foo.db
VOLUME ["/app/data"]
EXPOSE 8080
CMD ["./server"]
