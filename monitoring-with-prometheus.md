# Monitoring Infrastructure for the Application

## Deploy Resource Monitoring Infrastructure
[DockProm](https://github.com/stefanprodan/dockprom) project is used to monitor docker host and containers that are running on that host.

Deploy Prometheus:

```bash
docker volume create --name prometheus_data
docker run -d --network=demo-network \
            --name prometheus \
            -p 9090:9090 \
            -v $(pwd)/docker-compose-manifests/monitoring/prometheus/:/etc/prometheus/ \
            -v prometheus_data:/prometheus \
            --restart=on-failure \
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
            prom/node-exporter:v0.18.1 \
            '--path.procfs=/host/proc' \
            '--path.rootfs=/rootfs' \
            '--path.sysfs=/host/sys' \
            '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
```

Deploy cAdvisor:

```bash
docker run -d --network=demo-network \
            --name cadvisor \
            -p 8070:8080 \
            -v /:/rootfs:ro \
            -v /var/run:/var/run:rw \
            -v /sys:/sys:ro \
            -v /var/lib/docker/:/var/lib/docker:ro \
            --restart=on-failure \
            google/cadvisor:v0.33.0
```

Deploy Grafana:

```bash
docker volume create --name grafana_data
docker run -d --network=demo-network \
            --name grafana \
            -p 4000:3000 \
            -v grafana_data:/var/lib/grafana \
            -v $(pwd)/docker-compose-manifests/monitoring/grafana/provisioning:/etc/grafana/provisioning \
            -e GF_SECURITY_ADMIN_USER=admin \
            -e GF_SECURITY_ADMIN_PASSWORD=admin \
            -e GF_USERS_ALLOW_SIGN_UP=false \
            --restart=on-failure \
            grafana/grafana:6.3.6
```

Check everything is working properly:

```
docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED              STATUS                        PORTS                                                                                                                                                                                              NAMES
3c66719d0842        grafana/grafana:6.3.6           "/run.sh"                About a minute ago   Up About a minute             0.0.0.0:4000->3000/tcp                                                                                                                                                                             grafana
6636d77f098c        google/cadvisor:v0.33.0         "/usr/bin/cadvisor -…"   About a minute ago   Up About a minute (healthy)   0.0.0.0:8070->8080/tcp                                                                                                                                                                             cadvisor
ee93bd463056        prom/node-exporter:v0.18.1      "/bin/node_exporter …"   About a minute ago   Up About a minute             0.0.0.0:9100->9100/tcp                                                                                                                                                                             nodeexporter
e750f5602614        prom/prometheus:v2.12.0         "/bin/prometheus --c…"   About a minute ago   Up About a minute             0.0.0.0:9090->9090/tcp                                                                                                                                                                             prometheus
```

You can access to each service with the following addresses:

    - Prometheus Expression Browser: http://localhost:9090

    - Grafana UI: http://localhost:4000
        username: admin
        password: admin

## Tear Down

Stop running containers:

```bash
for container in grafana \
                 cadvisor \
                 nodeexporter \
                 prometheus
do
    docker stop $container
done
```

Remove running containers:

```bash
for container in grafana \
                 cadvisor \
                 nodeexporter \
                 prometheus
do
    docker rm -f $container
done
```

Remove created volumes:

```bash
for volume in grafana_data \
              prometheus_data
do
    docker volume rm $volume
done
```
