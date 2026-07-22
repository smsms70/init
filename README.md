# Init
the app is intented to work as a todo (toolbox in the future) similar to notion but running in local (not online support yet) to organize the ideas and start/advance in projects.

## Usage
1. copy the code below inside a ```docker-compose.yaml``` file and update it as need it.
``` yaml
services:
  init:
    container_name: init
    image: hefrenz/init:latest
    ports:
    - "8080:8080"
    environment:
      - ADMIN_PASSWORD=password #set here a custom password
      - ADMIN_USER=admin #default user, can't change it right now
    volumes:
      - db-data:/app/data

volumes:
  db-data:
```
2. run ```docker compose up -d``` to start the container (in older systems the syntax may be ```docker-compose up -d```).
3. go to the route (default ```localhost:8080```).

## dev
1. download the repository and run: 
```bash
docker compose -f docker-compose.dev.yaml build
```

2. then:
```bash
docker compose -f docker-compose.dev.yaml up --watch
```

this test version includes hot reload (```vite``` in the front and ```air``` command for golang), local db, and so on.

## about
the app it's in beta and still have not been fully tested!
api keys not fully secured yet!

