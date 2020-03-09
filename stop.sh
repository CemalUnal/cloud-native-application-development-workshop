#!/bin/bash

set -e

for i in "$@"
do
case $i in
    --kubernetes)
    kubernetes=true
    ;;
    --compose)
    compose=true
    ;;
    *)
    ;;
esac
done

function stop_with_compose {
    echo "Removing monitoring infrastructure..."
    for service in "docker-compose-manifests/logging/docker-compose.yml" \
                "docker-compose-manifests/monitoring/docker-compose.yml";
    do
        docker-compose -f $service down --remove-orphans
    done

    docker-compose -f docker-compose-manifests/docker-compose.yml down --remove-orphans
}

function stop_with_kubernetes {
    kubectl delete -f kubernetes-manifests
}

echo "Removing Sample App..."
if [ "$compose" == true ]; then
    stop_with_compose;
elif [ "$kubernetes" == true ]; then
    stop_with_kubernetes;
else
    stop_with_compose;
fi

# echo "Removing network..."
# docker network rm demo-compose-network
