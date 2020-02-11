# Kubernetes Manifests for the Sample Application

You can deploy the sample application by running the `start.sh` script with `--kubernetes` flag:

```bash
bash start.sh --kubernetes
```

Check everthing is working properly:

```bash
kubectl get pods -n k8s-demo -w
NAME                                          READY   STATUS    RESTARTS   AGE
gateway-deployment-66f5cbdc56-gbwnp           1/1     Running   0          27s
mongo-deployment-6dd4bd4564-76lkw             1/1     Running   0          28s
simple-backend-deployment-7688c96859-qzj97    1/1     Running   0          28s
simple-frontend-deployment-844f4598c7-pbqd2   1/1     Running   0          28s
```

### Tear Down
To delete everything, you can execute the following command:

```bash
bash stop.sh --kubernetes
```
