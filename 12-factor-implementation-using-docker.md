# Pure Docker Run Commands for the Sample Application

Create a network that is called `demo-network`:
```bash
docker network create demo-network
```

## Deploy Log Aggeration & Filtering Infrastructure

Following services are used to aggregate and filter the logs of running containers:

    - Fluentd        #  Aggregate logs and push them to Elasticsearch
    - Elasticsearch  #  Store log data
    - Kibana         #  Visualize logs

Deploy Elasticsearch:

```bash
docker volume create --name elasticsearch_data
docker run -p 9200:9200 -d --network=demo-network \
            --name elasticsearch \
            -v elasticsearch_data:/usr/share/elasticsearch/data \
            --restart=on-failure \
            -e ES_JAVA_OPTS="-Xms512m -Xmx512m" \
            -e discovery.type="single-node" \
            docker.elastic.co/elasticsearch/elasticsearch:7.2.0
```

Deploy Fluentd:

```bash
docker run -p 24224:24224 -d --network=demo-network \
            --name fluentd \
            --restart=on-failure \
            cunal/fluentd:v1.6-debian-1-elasticsearch
```

Deploy Kibana:

```bash
docker run -p 5601:5601 -d --network=demo-network \
            --name kibana \
            -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            kibana:7.2.0
```

## Deploy the Application

Create a volume for MongoDB and run its container.
```bash
docker volume create --name mongodb_data
docker run -p 27017:27017 -d --network=demo-network \
            --name mongodb \
            -v mongodb_data:/data/db \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            mongo:4.0.2
```

Run Backend:
```bash
docker run -d --network=demo-network \
            --name backend \
            -e MONGODB_URI="mongodb://mongodb:27017/sample-app" \
            -e JAVA_OPTS="-Dspring.profiles.active=local-docker -Xms125m -Xmx250m" \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-backend:6685333069ec622c9c314b95f6df6cf8cc02afe0
```

Run Redis:

```bash
docker volume create --name redis_data
docker run -p 6379:6379 -d --network=demo-network \
            --name redis \
            -v redis_data:/data \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            redis:5.0.6
```

Run Gateway:
```bash
docker run -p 9091:80 -d --network=demo-network \
            --name gateway \
            -e DEMO_BACKEND_SERVICE="http://backend" \
            -e JAVA_OPTS="-Dspring.profiles.active=local-docker -Xms125m -Xmx250m" \
            -e ZIPKIN_BASE_URL="http://jaeger:9411" \
            -e REDIS_HOST="redis" \
            -e REDIS_PORT="6379" \
            -e RATE_LIMIT_ENABLED="true" \
            -e RATE_LIMIT_REPOSITORY="REDIS" \
            -e RATE_LIMIT=4 \
            -e RATE_LIMIT_REFRESH_INTERVAL="1" \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-gateway:6685333069ec622c9c314b95f6df6cf8cc02afe0
```

Run Frontend:
```bash
docker run -p 5000:80 -d --network=demo-network \
            --name frontend \
            -e REACT_APP_BACKEND_URI=http://localhost:9091/api/demo-backend \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-frontend:6685333069ec622c9c314b95f6df6cf8cc02afe0
```

Check everything is working properly:

```
docker ps

CONTAINER ID        IMAGE                                                          COMMAND                  CREATED              STATUS              PORTS                                NAMES
8ad47aa644f3        cunal/demo-frontend:6685333069ec622c9c314b95f6df6cf8cc02afe0   "docker-entrypoint.s…"   34 seconds ago       Up 33 seconds       0.0.0.0:5000->80/tcp               frontend
e9102c555294        cunal/demo-gateway:6685333069ec622c9c314b95f6df6cf8cc02afe0    "/bin/sh -c 'java ${…"   46 seconds ago       Up 45 seconds       0.0.0.0:9091->80/tcp                 gateway
e4ef25f71967        redis:5.0.6                                                    "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:6379->6379/tcp               redis
4f217f57d5e8        cunal/demo-backend:6685333069ec622c9c314b95f6df6cf8cc02afe0    "/bin/sh -c 'java ${…"   3 minutes ago        Up 2 minutes                                             backend
f318beadce88        mongo:4.0.2                                                    "docker-entrypoint.s…"   3 minutes ago        Up 3 minutes        0.0.0.0:27017->27017/tcp             mongodb
56da65ab05e2        kibana:7.2.0                                                   "/usr/local/bin/kiba…"   3 minutes ago        Up 3 minutes        0.0.0.0:5601->5601/tcp               kibana
0bff5873062a        cunal/fluentd:v1.6-debian-1-elasticsearch                      "tini -- /bin/entryp…"   3 minutes ago        Up 3 minutes        5140/tcp, 0.0.0.0:24224->24224/tcp   fluentd
633aed9cb731        docker.elastic.co/elasticsearch/elasticsearch:7.2.0            "/usr/local/bin/dock…"   3 minutes ago        Up 3 minutes        0.0.0.0:9200->9200/tcp, 9300/tcp     elasticsearch
```

You can access to the sample application and Kibana at the following addresses respectively:

- Sample application: `http://localhost:5000`
- Kibana: `http://localhost:5601`

## Tear Down

Stop running containers:

```bash
for container in frontend \
                 gateway \
                 backend \
                 mongodb \
                 redis \
                 kibana \
                 fluentd \
                 elasticsearch
do
    docker stop $container
done
```

Remove running containers:

```bash
for container in frontend \
                 gateway \
                 backend \
                 mongodb \
                 redis \
                 kibana \
                 fluentd \
                 elasticsearch
do
    docker rm $container
done
```

Remove created volumes:

```bash
for volume in   elasticsearch_data \
                mongodb_data \
                redis_data
do
    docker volume rm $volume
done
```

Remove network:

```bash
docker network rm demo-network
```
