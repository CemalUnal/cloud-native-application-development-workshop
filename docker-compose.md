# Docker Compose Manifests for the Sample Application

Detailed information is omitted in this section since each step is explained in detail in the [12-factor-implementation-using-docker.md](12-factor-implementation-using-docker.md) and [monitoring-with-prometheus.md](monitoring-with-prometheus.md) files. You can start the demo application by running the `start.sh` script with `--compose flag`:

```bash
bash start.sh --compose
```

Check everything is working properly:

```
docker ps

CONTAINER ID        IMAGE                                                          COMMAND                  CREATED             STATUS                   PORTS                                                                                                                                                                                              NAMES
4ca215f3e6a2        cunal/mongodb-exporter:latest                                  "/bin/mongodb_export…"   2 minutes ago       Up 2 minutes             0.0.0.0:32771->9216/tcp                                                                                                                                                                            mongodb-exporter
651fb6957ee6        cunal/demo-gateway:6685333069ec622c9c314b95f6df6cf8cc02afe0    "/bin/sh -c 'java ${…"   2 minutes ago       Up 2 minutes             0.0.0.0:9091->80/tcp                                                                                                                                                                               gateway
0fc7da7d2087        cunal/demo-frontend:6685333069ec622c9c314b95f6df6cf8cc02afe0   "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes             0.0.0.0:5000->80/tcp                                                                                                                                                                               frontend
d80b8fe72383        jaegertracing/all-in-one:1.14                                  "/go/bin/all-in-one-…"   2 minutes ago       Up 2 minutes             0.0.0.0:5775->5775/tcp, 5775/udp, 0.0.0.0:5778->5778/tcp, 0.0.0.0:6831-6832->6831-6832/tcp, 0.0.0.0:9411->9411/tcp, 0.0.0.0:14268->14268/tcp, 6831-6832/udp, 0.0.0.0:16686->16686/tcp, 14250/tcp   jaeger
dee5eb67418e        mongo:4.0.2                                                    "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes             0.0.0.0:32768->27017/tcp                                                                                                                                                                           mongodb
ccc3699f21d5        cunal/demo-backend:6685333069ec622c9c314b95f6df6cf8cc02afe0    "/bin/sh -c 'java ${…"   2 minutes ago       Up 2 minutes             0.0.0.0:32770->80/tcp                                                                                                                                                                              backend
e9eca8876528        redis:5.0.6                                                    "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes             0.0.0.0:32769->6379/tcp                                                                                                                                                                            redis
ab9f454e7730        prom/prometheus:v2.12.0                                        "/bin/prometheus --c…"   2 minutes ago       Up 2 minutes             0.0.0.0:9090->9090/tcp                                                                                                                                                                             prometheus
ad09cc337798        google/cadvisor:v0.33.0                                        "/usr/bin/cadvisor -…"   2 minutes ago       Up 2 minutes (healthy)   0.0.0.0:8070->8080/tcp                                                                                                                                                                             cadvisor
10bfbbc8928a        prom/node-exporter:v0.18.1                                     "/bin/node_exporter …"   2 minutes ago       Up 2 minutes             0.0.0.0:9100->9100/tcp                                                                                                                                                                             nodeexporter
f89fc48bfaa1        grafana/grafana:6.3.6                                          "/run.sh"                2 minutes ago       Up 2 minutes             0.0.0.0:4000->3000/tcp                                                                                                                                                                             grafana
17c6733725ec        cunal/fluentd:v1.6-debian-1-elasticsearch                      "tini -- /bin/entryp…"   2 minutes ago       Up 2 minutes             5140/tcp, 0.0.0.0:24224->24224/tcp                                                                                                                                                                 fluentd
f5c63fc821b4        kibana:7.2.0                                                   "/usr/local/bin/kiba…"   2 minutes ago       Up 2 minutes             0.0.0.0:5601->5601/tcp                                                                                                                                                                             kibana
2043796a457d        docker.elastic.co/elasticsearch/elasticsearch:7.2.0            "/usr/local/bin/dock…"   2 minutes ago       Up 2 minutes             0.0.0.0:9200->9200/tcp, 9300/tcp                                                                                                                                                                   elasticsearch
```

### Tear Down

To delete everything, you can execute the following command

```bash
bash stop.sh --compose
```
