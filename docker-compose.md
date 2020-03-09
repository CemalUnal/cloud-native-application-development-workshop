# Docker Compose Manifests for the Sample Application

Detailed information is omitted in this section since each step is explained in detail in the [12-factor-implementation-using-docker.md](12-factor-implementation-using-docker.md) and [monitoring-with-prometheus.md](monitoring-with-prometheus.md) files. You can start the demo application by running the `start.sh` script with `--compose flag`:

```bash
bash start.sh --compose
```

Check everything is working properly:

```
docker ps

CONTAINER ID        IMAGE                                                 COMMAND                  CREATED             STATUS                    PORTS                                                                                                                                                                                              NAMES
487d2fbaac49        cunal/mongodb-exporter:latest                         "/bin/mongodb_export…"   24 minutes ago      Up 24 minutes             0.0.0.0:32771->9216/tcp                                                                                                                                                                            mongodb-exporter
d756ba3d114f        mongo:4.0.2                                           "docker-entrypoint.s…"   24 minutes ago      Up 24 minutes             0.0.0.0:32769->27017/tcp                                                                                                                                                                           mongodb
7be0a7610050        jaegertracing/all-in-one:1.14                         "/go/bin/all-in-one-…"   24 minutes ago      Up 24 minutes             0.0.0.0:5775->5775/tcp, 5775/udp, 0.0.0.0:5778->5778/tcp, 0.0.0.0:6831-6832->6831-6832/tcp, 0.0.0.0:9411->9411/tcp, 0.0.0.0:14268->14268/tcp, 6831-6832/udp, 0.0.0.0:16686->16686/tcp, 14250/tcp   jaeger
675441582ad6        redis:5.0.6                                           "docker-entrypoint.s…"   24 minutes ago      Up 24 minutes             0.0.0.0:32768->6379/tcp                                                                                                                                                                            redis
724ac88c3218        cunal/demo-backend:v0.0.2                             "/bin/sh -c 'java ${…"   24 minutes ago      Up 24 minutes             0.0.0.0:32770->80/tcp                                                                                                                                                                              backend
ef7a22417255        cunal/demo-frontend:v0.0.3                            "docker-entrypoint.s…"   24 minutes ago      Up 24 minutes             0.0.0.0:5000->5000/tcp                                                                                                                                                                             frontend
7a9979dbe043        cunal/demo-gateway:v0.0.3                             "/bin/sh -c 'java ${…"   24 minutes ago      Up 24 minutes             0.0.0.0:9091->80/tcp                                                                                                                                                                               gateway
ace01a77b656        grafana/grafana:6.3.6                                 "/run.sh"                24 minutes ago      Up 24 minutes             0.0.0.0:4000->3000/tcp                                                                                                                                                                             grafana
f1a50d8af931        google/cadvisor:v0.33.0                               "/usr/bin/cadvisor -…"   24 minutes ago      Up 24 minutes (healthy)   0.0.0.0:8070->8080/tcp                                                                                                                                                                             cadvisor
ea486ad30659        prom/prometheus:v2.12.0                               "/bin/prometheus --c…"   24 minutes ago      Up 24 minutes             0.0.0.0:9090->9090/tcp                                                                                                                                                                             prometheus
94beee8cb6bd        prom/node-exporter:v0.18.1                            "/bin/node_exporter …"   24 minutes ago      Up 24 minutes             0.0.0.0:9100->9100/tcp                                                                                                                                                                             nodeexporter
e79042f6647b        kibana:7.2.0                                          "/usr/local/bin/kiba…"   24 minutes ago      Up 24 minutes             0.0.0.0:5601->5601/tcp                                                                                                                                                                             kibana
4910a85f65f0        docker.elastic.co/elasticsearch/elasticsearch:7.2.0   "/usr/local/bin/dock…"   24 minutes ago      Up 24 minutes             0.0.0.0:9200->9200/tcp, 9300/tcp                                                                                                                                                                   elasticsearch
c82bb2a87c3f        cunal/fluentd:v1.6-debian-1-elasticsearch             "tini -- /bin/entryp…"   24 minutes ago      Up 24 minutes             5140/tcp, 0.0.0.0:24224->24224/tcp                                                                                                                                                                 fluentd
```

### Tear Down

To delete everything, you can execute the following command

```bash
bash stop.sh --compose
```
