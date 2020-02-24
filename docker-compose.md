# Docker Compose Manifests for the Sample Application

Detailed information is omitted in this section since each step is explained in detail in the [docker.md](docker.md). You can start the demo application by running the `start.sh` script:

```bash
bash start.sh --compose
```

Check everything is working properly:

```
docker ps


CONTAINER ID        IMAGE                                                 COMMAND                  CREATED             STATUS                 PORTS                                                                                                                                                                                              NAMES
a33026d9820a        cunal/demo-gateway:v0.0.2                             "/bin/sh -c 'java ${…"   5 hours ago         Up 5 hours             0.0.0.0:9091->80/tcp                                                                                                                                                                               gateway
11f2da17700f        mongo:4.0.2                                           "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:32777->27017/tcp                                                                                                                                                                           mongodb
cb07f9b7f7fb        cunal/demo-frontend:v0.0.1                            "docker-entrypoint.s…"   5 hours ago         Up 5 hours             0.0.0.0:5000->5000/tcp                                                                                                                                                                             frontend
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

### Tear Down

To delete everything, you can execute the following command

```bash
bash stop.sh --compose
```
