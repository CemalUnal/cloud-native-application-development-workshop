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
            -e SERVER_PORT=80 \
            -e MONGODB_URI="mongodb://mongodb:27017/sample-app" \
            -e JAVA_OPTS="-Dspring.profiles.active=deployment -Dserver.port=80 -Xms125m -Xmx250m" \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-backend:v0.0.2
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
            -e SERVER_PORT=80 \
            -e DEMO_BACKEND_SERVICE="http://backend" \
            -e JAVA_OPTS="-Dspring.profiles.active=deployment -Dserver.port=80 -Xms125m -Xmx250m" \
            -e ZIPKIN_BASE_URL="http://jaeger:9411" \
            -e REDIS_HOST="redis" \
            -e REDIS_PORT="6379" \
            -e RATE_LIMIT_ENABLED="true" \
            -e RATE_LIMIT_REPOSITORY="REDIS" \
            -e RATE_LIMIT="10" \
            -e RATE_LIMIT_REFRESH_INTERVAL="1" \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-gateway:v0.0.3
```

Run Frontend:
```bash
docker run -p 5000:5000 -d --network=demo-network \
            --name frontend \
            -e SERVER_PORT=5000 \
            -e REACT_APP_BACKEND_URI=http://localhost:9091/api/demo-backend \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-frontend:v0.0.3
```

Check everything is working properly:

```
docker ps


CONTAINER ID        IMAGE                                                 COMMAND                  CREATED             STATUS                 PORTS                                                                                                                                                                                              NAMES
a33026d9820a        cunal/demo-gateway:v0.0.3                             "/bin/sh -c 'java ${…"   5 hours ago         Up 5 hours             0.0.0.0:9091->80/tcp                                                                                                                                                                               gateway
11f2da17700f        mongo:4.0.2                                           "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:32777->27017/tcp                                                                                                                                                                           mongodb
cb07f9b7f7fb        cunal/demo-frontend:v0.0.3                            "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:5000->5000/tcp                                                                                                                                                                             frontend
d086480cd8b8        cunal/demo-backend:v0.0.2                             "/bin/sh -c 'java ${…"   5 hours ago         Up 5 hours             0.0.0.0:32778->80/tcp                                                                                                                                                                              backend
6b37f368c060        prom/node-exporter:v0.18.1                            "/bin/node_exporter …"   5 hours ago         Up 5 hours             0.0.0.0:9100->9100/tcp                                                                                                                                                                             nodeexporter
8c30df5cc20b        prom/prometheus:v2.12.0                               "/bin/prometheus --c…"   5 hours ago         Up 5 hours             0.0.0.0:9090->9090/tcp                                                                                                                                                                             prometheus
0fbe11bbf848        grafana/grafana:6.3.6                                 "/setup.sh"              5 hours ago         Up 5 hours             0.0.0.0:4000->3000/tcp                                                                                                                                                                             grafana
f86d659c3727        google/cadvisor:v0.33.0                               "/usr/bin/cadvisor -…"   5 hours ago         Up 5 hours (healthy)   0.0.0.0:8070->8080/tcp                                                                                                                                                                             cadvisor
821161e55444        logging_fluentd                                       "tini -- /bin/entryp…"   5 hours ago         Up 5 hours             5140/tcp, 0.0.0.0:24224->24224/tcp, 0.0.0.0:24224->24224/udp                                                                                                                                       fluentd
ebf2003a7726        docker.elastic.co/elasticsearch/elasticsearch:7.2.0   "/usr/local/bin/dock…"   5 hours ago         Up 5 hours             0.0.0.0:9200->9200/tcp, 9300/tcp                                                                                                                                                                   elasticsearch
e14dd564eb76        kibana:7.2.0                                          "/usr/local/bin/kiba…"   5 hours ago         Up 5 hours             0.0.0.0:5601->5601/tcp                                                                                                                                                                             kibana

```

You can access to each service with the following addresses:

    - Sample CRUD Application: http://localhost:5000

    - Kibana UI: http://localhost:5601

    - Grafana UI: http://localhost:4000
        username: admin
        password: admin

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
    docker rm -f $container
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
