# Cloud Native Application Development Workshop

## Repository Structure

- [Slides](./slides) contains the slides that are used in the workshop.
    - [part-1](./slides/part-1.pdf) An Introduction to Docker & 12 Factor App Implementation Using Docker
        - A brief introduction to Docker
        - 12 Factor App implementation using Docker (Sample CRUD application deployment)
    - [part-2](./slides/part-2.pdf) Monitoring with Prometheus
        - What is monitoring and why does is important for us ?
        - A brief introduction to Prometheus and how can it be used to monitor applications ?
        - Which metrics to monitor ?
        - Alerting
    - [part-3](./slides/part-3.pdf) Cloud Native Application Development on Kubernetes
        - A brief introduction to Kubernetes and Kubernetes concepts
        - Sample CRUD application deployment using Kubernetes
        - Container locality in Kubernetes
        - Multi-tenancy in Kubernetes
- [docker-manifests](./docker-manifests) and [kubernetes-manifests](./kubernetes-manifests) directories contain Docker Compose and Kubernetes manifests for the sample application that is available in [this repository](https://github.com/cemalunal/sample-crud-app).
- [docker.md](./docker.md) describes how the sample application can be run locally using `docker run` commands in detail.
- [docker-compose.md](./docker-compose.md) describes how the sample application can be run locally using Docker Compose.
- [kubernetes.md](./kubernetes.md) describes how the sample application can be deployed to a Kubernetes cluster.

## Setting the Environment

### Prerequisites for [part-1](./slides/part-1.pdf) and [part-2](./slides/part-2.pdf):

* git 2.20.1+
* docker 19.03.2+
* docker-compose 1.23.2+

### Installing Git

#### Linux

Please consult to [this documentation](https://git-scm.com/download/linux) in order to install git on different Linux distributions.

#### Mac

Download and run the installer from [this address](https://git-scm.com/download/mac) in order to install git on MacOS.

#### Windows

Download and run the installer from [this address](https://git-scm.com/download/win) in order to install git on Windows.


### Installing Docker

#### Linux
Fetch the [get-docker.sh](https://get.docker.com/) script with the following command:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
```

Execute it (Requires sudo privileges):

```bash
sh get-docker.sh
```

#### Mac
- Docker for Mac can be used to install and run docker on MacOS. Please refer to the [official documentation](https://docs.docker.com/docker-for-mac/) for the installation instructions.

#### Windows
- Docker for Windows can be used to install and run docker on Windows. Please refer to the [official documentation](https://docs.docker.com/docker-for-windows/) for the installation instructions.


### Installing Docker Compose

#### Linux

See the official [installation documentation](https://docs.docker.com/compose/install/) for the installation instructions.

#### Mac
Docker for Mac already includes Docker Compose.

#### Windows
Docker for Windows already includes Docker Compose.

### Prerequisites for the [part-3](./slides/part-3.pdf):
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

