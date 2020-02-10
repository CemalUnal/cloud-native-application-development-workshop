# Intro to Docker and Kubernetes

## Repository Structure
- [docker-compose-manifests](./kubernetes-resources) contains the manifests for basic Kubernetes resources.
- [kubernetes-manifests](./kubernetes-resources) contains the manifests for basic Kubernetes resources.
- [sample-app](./sample-app) contains the Kubernetes manifests for a simple frontend and a backend.

## Setting the Environment

### Installing Docker

#### Linux
- [Get Docker Script](https://get.docker.com/)

#### Mac
- [Docker for Mac](https://docs.docker.com/docker-for-mac/)

#### Windows
- [Docker for Windows](https://docs.docker.com/docker-for-windows/)


### Installing Docker Compose

#### Linux

Download the current stable release of Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

See the official [installation documentation](https://docs.docker.com/compose/install/) for further configuration.

#### Mac
Docker for Mac already includes Docker Compose.

#### Windows
Docker for Windows already includes Docker Compose.


### Installing Kubernetes Locally
We can spin up a Kubernetes for demo purposes. There are two good options:

- [Kubernetes in Docker](https://kind.sigs.k8s.io/)
- [microk8s](https://microk8s.io/)


### Using microk8s
You can quickly create single node Kubernetes cluster with microk8s:

```bash
$ sudo snap install microk8s --classic
$ microk8s.kubectl get namespaces
```

Optionally you can set alias for **microk8s.kubectl** command:
```bash
$ alias "kubectl"="microk8s.kubectl"
```

Enable dns:

```bash
$ microk8s.enable dns
$ sudo ufw allow in on cbr0 && sudo ufw allow out on cbr0
$ sudo iptables -P FORWARD ACCEPT
$ sudo apt-get install iptables-persistent
```

Check everything is working properly:

```bash
$ kubectl get nodes

NAME             STATUS   ROLES    AGE   VERSION
dell-precision   Ready    <none>   26h   v1.15.0
```

### Using Kubernetes in Docker(kind)
It is already installed on your machines. You can restart it by executing the following command in your terminal:

```bash
$ docker ps -a

CONTAINER ID        IMAGE                   CREATED             STATUS                 NAMES
03730892123c        kindest/node:v1.14.2   8 days ago      Exited (130) 4 days ago  kind-control-plane

$ docker restart kind-control-plane
```

You can see that the with the following command:
```bash
$ docker ps
```

If it does not start, then remove the kind-control-plane container:

```bash
$ docker rm -f kind-control-plane
```

Recrate the cluster:

```bash
$ cd ~/go/bin/
$ ./kind create cluster
$ export KUBECONFIG="$(./kind get kubeconfig-path --name="kind")"
```

Check everything is working properly:

```bash
$ kubectl cluster-info
$ kubectl get nodes -owide
```

## Running the Sample Application

### Docker Compose Way

You can start the demo application by running the `start.sh` script:

```bash
bash start.sh
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

### Resource Monitoring
[DockProm](https://github.com/stefanprodan/dockprom) project is used to monitor docker host and containers that are running on that host. Please consult to [this](https://github.com/stefanprodan/dockprom/blob/master/README.md) documentation for further information.


### Log Aggeration & Filtering
Elasticsearch, Fluentd and Kibana are used to aggregate and filter the logs of running containers.

TODO: multiline log filtering
TODO: try to explain this section in more detail

### Request Tracing

[Jaeger](https://www.jaegertracing.io/) is used with API Gateway to trace requests.


You can access to each service with the following addresses:

    - Kibana UI
        Address: http://localhost:5601

    - Grafana UI
        Address: http://localhost:4000
        username: admin
        password: admin
        Dashboard1: http://localhost:4000/d/OBa6sQ8Zk/docker-containers
        Dashboard2: http://localhost:4000/d/wQaesQUZz/docker-host
        Dashboard3: http://localhost:4000/d/Feaesw8Wz/monitor-services

    - Jaeger UI
        Address: http://localhost:16686/search

### Kubernetes Way
Change your directory to the `sample-app` folder. Apply the Kubernetes manifests:

```bash
cd sample-app
for manifest in namespace mongodb gateway frontend backend; 
do 
    kubectl apply -f $manifest.yaml
done
```

### Tear Down
To delete everything, you can execute the following command

```bash
cd sample-app
for manifest in namespace mongodb gateway frontend backend; 
do 
    kubectl delete -f $manifest.yaml
done
```

https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours-a-detailed-guide-to-orchestrating-containers-114ff420e882/
