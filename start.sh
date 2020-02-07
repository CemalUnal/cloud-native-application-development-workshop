#!/bin/bash

set -e

for i in "$@"
do
case $i in
    --kubernetes=*)
    kubernetes="${i#*=}"
    ;;
    --compose=*)
    compose="${i#*=}"
    ;;
    *)
    ;;
esac
done

function check_network_exists {
    docker network ls | grep -q demo-network
}

function start_with_compose {
    if check_network_exists; then
        echo "Network demo-network already exists, using existing one..."
    else
        echo "Creating network demo-network..."
        docker network create demo-network
    fi

    echo "Deploying monitoring infrastructure..."
    for service in "docker-compose-manifests/logging/docker-compose.yml" \
                "docker-compose-manifests/monitoring/docker-compose.yml";
    do
        docker-compose -f $service up -d
    done

    echo "Deploying using Docker Compose..."
    docker-compose -f docker-compose-manifests/docker-compose.yml up -d
}

function start_with_kubernetes {
    kubectl apply -f kubernetes-manifests
}

echo "Starting Sample App..."
if [ "$compose" == true ]; then
    start_with_compose;
elif [ "$compose" == true ]; then
    start_with_kubernetes;
else
    start_with_compose;
fi
