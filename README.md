# Run as Containerization
Run the apps with a docker. First step you must configure the network.
This is used to split into different networks each container

### Create a docker network
- Postgres network
```docker
docker network create residential-db-network
```
- Frontend network
```docker
docker network create residential-fe-network
```
- Backend network
```docker
docker network create residential-be-network
```
After creating a docker network, you may proceed to build the container, with command
```docker
docker compose up -d
```

After the process is completed, you can run the application.
```djangourlpath
localhost:3000
```