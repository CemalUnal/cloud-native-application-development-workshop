# intro-to-k8s-bvayo-2019
This repository contains the materials for Introduction to Kubernetes for BVAYO 2019. It contains example Kubernetes manifests for common Kubernetes resources.

## Repository Structure
- [kubernetes-resources](./kubernetes-resources) contains the manifests for basic Kubernetes resources.

- [sample-app](./sample-app) contains the Kubernetes manifests for a simple frontend and a backend.

## Setting the Environment
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

### Deploying Sample application to the Kubernetes
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
