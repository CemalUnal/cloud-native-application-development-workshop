# Intro to Docker and Kubernetes

## Repository Structure

- [sample-app](./sample-app) contains a sample CRUD application that is ready to be deployed as Docker containers.
- [docker-manifests](./docker-manifests) contains the Docker Compose manifests for the sample application.
- [kubernetes-manifests](./kubernetes-manifests) contains the Kubernetes manifests for the sample application.
- [docker-compose.md](./docker-compose.md) describes how the sample application can be run locally using Docker Compose.
- [kubernetes.md](./kubernetes.md) describes how the sample application can be deployed to a Kubernetes cluster.

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

#### Using Minikube

#### Linux


#### Mac

```bash
brew install minikube
```

```bash
minikube start --vm-driver=hyperkit
```

#### Windows


TODO: minikube guide will be here.

TODO: update mongo manifests according to minikube volume management

## Running the Sample Application

### Pure Docker Way

Please continue reading from [this documentation](./docker.md) in order to deploy sample application using `docker run`.

### Docker Compose Way

Please continue reading from [this documentation](./docker-compose.md) in order to deploy sample application using Docker Compose.

### Kubernetes Way

Please continue reading from [this documentation](./kubernetes.md) in order to deploy sample application using Kubernetes.

TODO: https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours-a-detailed-guide-to-orchestrating-containers-114ff420e882/
