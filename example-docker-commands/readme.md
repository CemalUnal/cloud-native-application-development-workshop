## Example Docker Commands

### Docker run
Simple docker run example:

```bash
docker run --name greeting ubuntu:18.04 echo 'Hello world, I am a container!'
```

### Docker build 
Build a docker image using [this Dockerfile](./Dockerfile):

```bash
docker build -t ubuntu-based-nginx:v1 .
```

Check newly built image:

```bash
docker image ls
```

```
REPOSITORY                                      TAG                             IMAGE ID            CREATED             SIZE
ubuntu-based-nginx                              v1                              02acf5ee6c20        12 seconds ago      152MB
```

Run newly built nginx image:

```bash
docker run -d -p 8080:80 ubuntu-based-nginx:v1
```

Check container is running properly:

```bash
docker ps
```

```
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                    NAMES
d27f607046a5        ubuntu-based-nginx:v1   "nginx -g 'daemon of…"   5 seconds ago       Up 4 seconds        0.0.0.0:8080->80/tcp     admiring_goldwasser
```

Then visit `http://localhost:8080`.

### Docker volumes

By default all files created inside a container do not persist when that container no longer exists. In order to persist data between different container instances we can create a volume to be used by these container instances.

#### PostgreSQL example

Start a fres PostgreSQL container:

```bash
docker run --name postgres -d -e POSTGRES_PASSWORD=passwd postgres:10
```

Create a shell inside the running container:

```bash
docker exec -it postgres bash
```

Connect to `postgres` database:
```
psql --user postgres
\c postgres
```

Create `users` table and insert a row to that table:
```
CREATE TABLE users (
   ID serial PRIMARY KEY,
   name VARCHAR (255) NOT NULL
);
INSERT INTO users (name) VALUES ('Test');
SELECT * FROM users;
```

```
 id | name 
----+------
  1 | Test
(1 row)
```

Exit from postgres and the container

```bash
\q
exit
```

Stop and remove PostgreSQL container:

```bash
docker stop postgres
docker rm postgres
```

Again run a PostgreSQL container:

```bash
docker run --name postgres -d -e POSTGRES_PASSWORD=passwd postgres:10
```

Connect to postgres database and notice that the newly created table is not persisted and deleted:

```bash
docker exec -it postgres bash

psql --user postgres
\c postgres

SELECT * FROM users;
ERROR:  relation "users" does not exist
```

Exit and remove running container:

```
\q
exit

docker stop postgres
docker rm postgres
```

In order to prevent this situation lets create a volume that will be used by PostgreSQL container:

```bash
docker volume create --name postgres_data
```

List create volume:
```bash
docker volume ls
DRIVER              VOLUME NAME
local               postgres_data
```

Create a PostgreSQL container that uses this volume:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=passwd -v postgres_data:/var/lib/postgresql/data -d postgres:10
```

Connect to running PostgreSQL container and create sample table with above commands:

```bash
docker exec -it postgres bash

psql --user postgres
\c postgres

CREATE TABLE users (
   ID serial PRIMARY KEY,
   name VARCHAR (255) NOT NULL
);
INSERT INTO users (name) VALUES ('Test');
SELECT * FROM users;
```

Exit and remove running container:

```
\q
exit

docker stop postgres
docker rm postgres
```

Again run a PostgreSQL container that is using the same volume with the previously killed container:

```bash
docker run --name postgres_new -e POSTGRES_PASSWORD=passwd -v postgres_data:/var/lib/postgresql/data -d postgres:10
```

Connect to postgres database and notice that the newly created table is still there with its data in it:

```bash
docker exec -it postgres_new bash

psql --user postgres
\c postgres

SELECT * FROM users;
 id | name 
----+------
  1 | Test
```

Exit and remove running container:

```
\q
exit

docker stop postgres_new
docker rm postgres_new
```

Also you can directly mount host directory as volume to your container:

```bash
docker run --name postgres_new -v $(pwd)/data:/var/lib/postgresql/data -d postgres:10
```

### Docker networks

Create a network:

```bash
docker network create test-network
```

List created network:

```
docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
b1016282ac96        test-network        bridge              local
```

Start a Redis container that is attached to the `test-network`:

```bash
docker run -d --network=test-network --name=redis redis
```

Start an Alpine linux container that is also attached to the `test-network` and try to ping redis container:

```bash
docker run --network=test-network --name=alpine alpine ping redis
```

Alpine container can ping redis container by using its name as the hostname since they are running on the same network:

```
PING redis (172.19.0.2): 56 data bytes
64 bytes from 172.19.0.2: seq=0 ttl=64 time=0.184 ms
64 bytes from 172.19.0.2: seq=1 ttl=64 time=0.175 ms
64 bytes from 172.19.0.2: seq=2 ttl=64 time=0.137 ms
64 bytes from 172.19.0.2: seq=3 ttl=64 time=0.190 ms
```

If we start an alpine container that without specifying any network:

```bash
docker run --name=alpine-test alpine ping redis
```

ping operation fails:
```
ping: bad address 'redis'
```

You can stop and remove redis instance to prevent conflict with the later examples:
```bash
docker stop redis
docker rm redis
```
