# Pure Docker Run Commands for the Sample Application

Create a network that is called `demo-network`:
```bash
docker network create demo-network
```

## Deploy Log Aggeration & Filtering Infrastructure

Following services are used to aggregate and filter the logs of running containers:

    - Elasticsearch  #  
    - Fluentd        #  Aggregate logs and push them to Elasticsearch
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

## Deploy Resource Monitoring Infrastructure
[DockProm](https://github.com/stefanprodan/dockprom) project is used to monitor docker host and containers that are running on that host.

Deploy Prometheus:

```bash
docker volume create --name prometheus_data
docker run -d --network=demo-network \
            --name prometheus \
            -p 9090:9090 \
            -v $(pwd)/docker-manifests/monitoring/prometheus/:/etc/prometheus/ \
            -v prometheus_data:/prometheus \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            prom/prometheus:v2.12.0 \
            '--config.file=/etc/prometheus/prometheus.yml' \
            '--storage.tsdb.path=/prometheus' \
            '--web.console.libraries=/etc/prometheus/console_libraries' \
            '--web.console.templates=/etc/prometheus/consoles' \
            '--storage.tsdb.retention.time=200h' \
            '--web.enable-lifecycle'
```

Deploy Node Exporter:

```bash
docker run -d --network=demo-network \
            --name nodeexporter \
            -p 9100:9100 \
            -v /proc:/host/proc:ro \
            -v /sys:/host/sys:ro \
            -v /:/rootfs:ro \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            prom/node-exporter:v0.18.1 \
            '--path.procfs=/host/proc' \
            '--path.rootfs=/rootfs' \
            '--path.sysfs=/host/sys' \
            '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
```

Deploy cAdvisor:

TODO: does it work without cgroup on Linux ?
```bash
docker run -d --network=demo-network \
            --name cadvisor \
            -p 8070:8080 \
            -v /:/rootfs:ro \
            -v /var/run:/var/run:rw \
            -v /sys:/sys:ro \
            -v /var/lib/docker/:/var/lib/docker:ro \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            google/cadvisor:v0.33.0
```

Deploy Grafana:

```bash
docker volume create --name grafana_data
docker run -d --network=demo-network \
            --name grafana \
            -p 4000:3000 \
            -v grafana_data:/var/lib/grafana \
            -v $(pwd)/docker-manifests/monitoring/grafana/provisioning:/etc/grafana/provisioning \
            -e GF_SECURITY_ADMIN_USER=admin \
            -e GF_SECURITY_ADMIN_PASSWORD=admin \
            -e GF_USERS_ALLOW_SIGN_UP=false \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            grafana/grafana:6.3.6
```

## Deploy Sample CRUD Application

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
            cunal/demo-backend:v0.0.1
```

Run Jaeger in order to collect and trace requests:
```bash
docker volume create --name jaeger_badger_data
docker run -d --network=demo-network -p 5775:5775 \
            --name jaeger \
            -p 6831:6831 \
            -p 6832:6832 \
            -p 5778:5778 \
            -p 16686:16686 \
            -p 14268:14268 \
            -p 9411:9411 \
            -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
            -e SPAN_STORAGE_TYPE=badger \
            -e BADGER_EPHEMERAL=false \
            -e BADGER_DIRECTORY_VALUE="/badger/data" \
            -e BADGER_DIRECTORY_KEY="/badger/key" \
            -v jaeger_badger_data:/badger \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            jaegertracing/all-in-one:1.14
```

Run Gateway:
```bash
docker run -p 9091:80 -d --network=demo-network \
            --name gateway \
            -e SERVER_PORT=80 \
            -e SIMPLE_BACKEND_SERVICE="http://backend" \
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
            cunal/demo-gateway:v0.0.2
```

Run Frontend:

```bash
docker run -p 5000:5000 -d --network=demo-network \
            --name frontend \
            -e SERVER_PORT=5000 \
            -e REACT_APP_BACKEND_URI=http://localhost:9091/api/simple-backend \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/demo-frontend:v0.0.2
```

Run MongoDB exporter in order to expose MongoDB metrics to be scraped by Prometheus later on:

```bash
docker run -d --network=demo-network \
            --name mongodb-exporter \
            -e MONGODB_URI=mongodb://mongodb:27017 \
            --restart=on-failure \
            --log-driver=fluentd --log-opt fluentd-address=localhost:24224 \
            cunal/mongodb-exporter:latest
```

Check everything is working properly:

```
docker ps


CONTAINER ID        IMAGE                                                 COMMAND                  CREATED             STATUS                 PORTS                                                                                                                                                                                              NAMES
a33026d9820a        cunal/demo-gateway:v0.0.2                             "/bin/sh -c 'java ${…"   5 hours ago         Up 5 hours             0.0.0.0:9091->80/tcp                                                                                                                                                                               gateway
11f2da17700f        mongo:4.0.2                                           "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:32777->27017/tcp                                                                                                                                                                           mongodb
cb07f9b7f7fb        cunal/demo-frontend:v0.0.2                            "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:5000->5000/tcp                                                                                                                                                                             frontend
97e255eac655        jaegertracing/all-in-one:1.14                         "/go/bin/all-in-one-…"   5 hours ago         Up 5 hours             0.0.0.0:5775->5775/tcp, 5775/udp, 0.0.0.0:5778->5778/tcp, 0.0.0.0:6831-6832->6831-6832/tcp, 0.0.0.0:9411->9411/tcp, 0.0.0.0:14268->14268/tcp, 6831-6832/udp, 0.0.0.0:16686->16686/tcp, 14250/tcp   jaeger
d086480cd8b8        cunal/demo-backend:v0.0.1                             "/bin/sh -c 'java ${…"   5 hours ago         Up 5 hours             0.0.0.0:32778->80/tcp                                                                                                                                                                              backend
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

    - Jaeger UI: http://localhost:16686/search


## Tear Down

Stop running containers:

```bash
for container in frontend \
                 gateway \
                 jaeger \
                 backend \
                 mongodb \
                 kibana \
                 fluentd \
                 elasticsearch \
                 grafana \
                 cadvisor \
                 nodeexporter \
                 prometheus \
                 mongodb-exporter
do
    docker stop $container
done
```

Remove running containers:

```bash
for container in frontend \
                 gateway \
                 jaeger \
                 backend \
                 mongodb \
                 kibana \
                 fluentd \
                 elasticsearch \
                 grafana \
                 cadvisor \
                 nodeexporter \
                 prometheus \
                 mongodb-exporter
do
    docker rm -f $container
done
```

Remove created volumes:

```bash
for volume in   elasticsearch_data \
                grafana_data \
                jaeger_badger_data \
                mongodb_data \
                prometheus_data
do
    docker volume rm $volume
done
```

Remove network:

```bash
docker network rm demo-network
```
