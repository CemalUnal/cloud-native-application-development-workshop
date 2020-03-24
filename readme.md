# Cloud Native Application Development Workshop

## Repository Structure

- [slides](./slides) directory contains the slides that are used in the workshop.
    - [Part-1 An Introduction to Docker & 12 Factor App Implementation Using Docker](./slides/an-introduction-to-docker-and-12-app-implementation-using-docker.pdf)
        - A brief introduction to Docker
        - 12 Factor App implementation using Docker (Sample CRUD application deployment)
    - [Part-2 An Introduction to Prometheus](./slides/an-introduction-to-prometheus.pdf)
        - Prometheus Ecosystem and Architecture
        - Data Model and Metric Types
        - Visualization and Alerting based on Observed Metrics
    - [Part-3 An Introduction to Kubernetes](./slides/an-introduction-to-kubernetes.pdf)
        - A brief introduction to Kubernetes and its concepts
        - Sample CRUD application deployment using Kubernetes
        - Container Locality on Kubernetes
        - Software Multi-Tenancy Using Kubernetes

- [example-docker-commands](./example-docker-commands) contains sample Docker commands that will get you familiar with Docker concepts and its CLI usage.

- [docker-compose-manifests](./docker-compose-manifests) and [kubernetes-manifests](./kubernetes-manifests) directories contain Docker Compose and Kubernetes manifests for the sample application that is available in [this repository](https://github.com/cemalunal/sample-crud-app).

- [12-factor-implementation-using-docker.md](./12-factor-implementation-using-docker.md) describes how the sample application can be run locally using `docker run` commands in detail by following [12 Factor App methodology](https://12factor.net/).

- [docker-compose.md](./docker-compose.md) describes how the sample application can be run locally using Docker Compose.

- [kubernetes.md](./kubernetes.md) describes how the sample application can be deployed to a Kubernetes cluster.

- [monitoring-with-prometheus.md](./monitoring-with-prometheus.md) describes how can we deploy a monitoring infrastructure using Prometheus.

## Setting the Environment

### Prerequisites for [part-1](./slides/an-introduction-to-docker-and-12-app-implementation-using-docker.pdf) and [part-2](./slides/an-introduction-to-prometheus.pdf):

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

### Prerequisites for the [part-3](./slides/an-introduction-to-kubernetes.pdf):
### Installing Kubernetes Locally

#### Using Minikube

#### Linux
TBD

#### Mac

```bash
brew install minikube
```

```bash
minikube start --vm-driver=hyperkit
```

#### Windows
TBD

### PART-1

#### Docker Demo

Change your directory to `example-docker-commands`:

```bash
cd example-docker-commands
```

Then continue reading from [example-docker-commands/readme.md](./example-docker-commands/readme.md) to get familiar with Docker concepts and cli usage.

#### 12 Factor App Implementation

After completing the examples in the above document, you can continue to read from [12-factor-implementation-using-docker.md](./12-factor-implementation-using-docker.md) to start deploying the sample application by following the 12 factor app principles.

Change your directory to root folder:

```bash
cd ..
```

Then you can start executing the commands that are available in [12-factor-implementation-using-docker.md](./12-factor-implementation-using-docker.md). Also the Docker Compose guide of the sample application is available in [docker-compose.md](./docker-compose.md).

### PART-2

[An Introduction to Prometheus](./introduction-to-prometheus.md) contains the installation and configuration of [Node Exporter](https://github.com/prometheus/node_exporter/blob/master/README.md), [Prometheus](https://prometheus.io/) and [AlertManager](https://prometheus.io/docs/alerting/alertmanager/). Also it describes how you can use these tools in order to monitor your local environment and create and send custom alerts using Slack.

[Monitoring with Prometheus](./monitoring-with-prometheus.md) contains the deployment instructions for the monitoring infrastructure using Docker in your local environment.

### PART-3
[An Introduction to Kubernetes](./kubernetes.md) describes the deployment steps of the sample application on top of Kubernetes.

