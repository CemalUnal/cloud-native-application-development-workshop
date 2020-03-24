# Kubernetes Features Walkthrough

In this section we will mostly follow the official Kubernetes documentation. Example tasks available in [this address](https://kubernetes.io/docs/tasks).

## Run a Stateless Application Using a Deployment

https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/

## Assign Resource Limits to Pods

We will start by deploying [metrics-server](https://github.com/kubernetes-sigs/metrics-server) in order to observe metrics and also it is required to Horizontal Pod Autoscaler to work which we will cover in the next step:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: metrics-server:system:auth-delegator
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:auth-delegator
subjects:
- kind: ServiceAccount
  name: metrics-server
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: metrics-server-auth-reader
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: extension-apiserver-authentication-reader
subjects:
- kind: ServiceAccount
  name: metrics-server
  namespace: kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: metrics-server
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: system:metrics-server
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - nodes
  - nodes/stats
  - namespaces
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - "extensions"
  resources:
  - deployments
  verbs:
  - get
  - list
  - update
  - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system:metrics-server
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:metrics-server
subjects:
- kind: ServiceAccount
  name: metrics-server
  namespace: kube-system
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: metrics-server-config
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: EnsureExists
data:
  NannyConfiguration: |-
    apiVersion: nannyconfig/v1alpha1
    kind: NannyConfiguration
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: metrics-server
  namespace: kube-system
  labels:
    k8s-app: metrics-server
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
    version: v0.3.1
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
      version: v0.3.1
  template:
    metadata:
      name: metrics-server
      labels:
        k8s-app: metrics-server
        version: v0.3.1
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ''
        seccomp.security.alpha.kubernetes.io/pod: 'docker/default'
    spec:
      priorityClassName: system-cluster-critical
      serviceAccountName: metrics-server
      containers:
      - name: metrics-server
        image: k8s.gcr.io/metrics-server-amd64:v0.3.1
        command:
        - /metrics-server
        - --metric-resolution=30s
        - --kubelet-preferred-address-types=InternalIP
        - --kubelet-insecure-tls
        ports:
        - containerPort: 443
          name: https
          protocol: TCP
      - name: metrics-server-nanny
        image: k8s.gcr.io/addon-resizer:1.8.4
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 5m
            memory: 50Mi
        env:
          - name: MY_POD_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
          - name: MY_POD_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
        volumeMounts:
        - name: metrics-server-config-volume
          mountPath: /etc/config
        command:
          - /pod_nanny
          - --config-dir=/etc/config
          - --cpu=300m
          - --extra-cpu=20m
          - --memory=200Mi
          - --extra-memory=10Mi
          - --threshold=5
          - --deployment=metrics-server
          - --container=metrics-server
          - --poll-period=300000
          - --estimator=exponential
          - --minClusterSize=2
      volumes:
        - name: metrics-server-config-volume
          configMap:
            name: metrics-server-config
      tolerations:
        - key: "CriticalAddonsOnly"
          operator: "Exists"
        - key: node-role.kubernetes.io/master
          effect: NoSchedule
---
apiVersion: v1
kind: Service
metadata:
  name: metrics-server
  namespace: kube-system
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: "Metrics-server"
spec:
  selector:
    k8s-app: metrics-server
  ports:
  - port: 443
    protocol: TCP
    targetPort: https
---
apiVersion: apiregistration.k8s.io/v1beta1
kind: APIService
metadata:
  name: v1beta1.metrics.k8s.io
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
spec:
  service:
    name: metrics-server
    namespace: kube-system
  group: metrics.k8s.io
  version: v1beta1
  insecureSkipTLSVerify: true
  groupPriorityMinimum: 100
  versionPriority: 100
EOF
```

Wait until the `metrics-server` up and running:

```bash
kubectl get pods -n kube-system | grep metrics-server

metrics-server-676685b6cd-h5lgc            2/2     Running   0          82s
```

After that we can follow [this guide](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/) from the official documentation.

## Horizontal Pod Autoscaler

We will follow [this guide](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) from the official Kubernetes documentation in order to demonstrate Horizontal Pod Autoscaler.

## Deploying Sample Appplication

After that we will create a namespace to deploy our sample application:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: k8s-demo
EOF
```

Deploy standalone MongoDB:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mongo-deployment
  namespace: k8s-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo-deployment
  template:
    metadata:
      labels:
        app: mongo-deployment
    spec:
      containers:
      - image: mongo:4.0.2
        name: mongo-deployment
        ports:
          - containerPort: 27017
        imagePullPolicy: IfNotPresent
---
apiVersion: v1
kind: Service
metadata:
  name: mongo-deployment
  namespace: k8s-demo
  labels:
    app: mongo-deployment
spec:
  ports:
  - port: 27017
  selector:
    app: mongo-deployment
EOF
```

Deploy Backend Service:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: demo-backend-cm
  namespace: k8s-demo
data:
  MONGODB_URI: "mongodb://mongo-deployment.k8s-demo.svc.cluster.local:27017/sample-app"
  JAVA_OPTS: "-Dspring.profiles.active=local-docker -Xms125m -Xmx250m"

---

apiVersion: v1
kind: Service
metadata:
  name: demo-backend-deployment-service
  namespace: k8s-demo
  labels:
    app: demo-backend-deployment
spec:
  type: ClusterIP
  ports:
    - port: 80
  selector:
    app: demo-backend-deployment

---

apiVersion: apps/v1
kind: Deployment
metadata: 
  name: demo-backend-deployment
  labels:        
    app: demo-backend-deployment
  namespace: k8s-demo
spec: 
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: demo-backend-deployment
  template: 
    metadata:
      labels:        
        app: demo-backend-deployment
    spec:
      containers:
        - image: cunal/demo-backend:6685333069ec622c9c314b95f6df6cf8cc02afe0
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              memory: "250Mi"
              cpu: "300m"
            limits:
              memory: "300Mi"
              cpu: "400m"
          name: demo-backend-deployment
          ports: 
            - containerPort: 80
          envFrom:
          - configMapRef:
              name: demo-backend-cm

---

apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: demo-backend-hpa
  namespace: k8s-demo
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: demo-backend-deployment
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 80
EOF
```

Deploy standalone Redis instance:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: k8s-demo
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:5.0.6
        ports:
        - containerPort: 6379
          name: client
        - containerPort: 16379
          name: gossip

---

apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: k8s-demo
spec:
  type: ClusterIP
  ports:
  - port: 6379
    targetPort: 6379
    name: client
  - port: 16379
    targetPort: 16379
    name: gossip
  selector:
    app: redis
EOF
```

Deploy Gateway:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: gateway-cm
  namespace: k8s-demo
data:
  DEMO_BACKEND_SERVICE: "http://demo-backend-deployment-service"
  JAVA_OPTS: "-Dspring.profiles.active=local-docker -Xms125m -Xmx250m"
  REDIS_HOST: "redis"
  REDIS_PORT: "6379"
  RATE_LIMIT_ENABLED: "false"
  RATE_LIMIT_REPOSITORY: "REDIS"
  RATE_LIMIT: "10"
  RATE_LIMIT_REFRESH_INTERVAL: "1"

---

apiVersion: v1
kind: Service
metadata:
  name: gateway-deployment-service
  namespace: k8s-demo
  labels:
    app: gateway-deployment
spec:
  type: ClusterIP
  ports:
    - port: 80
  selector:
    app: gateway-deployment

---

apiVersion: apps/v1
kind: Deployment
metadata: 
  name: gateway-deployment
  labels:        
    app: gateway-deployment
  namespace: k8s-demo
spec: 
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: gateway-deployment
  template: 
    metadata:
      labels:        
        app: gateway-deployment
    spec:
      containers:
        - image: cunal/demo-gateway:6685333069ec622c9c314b95f6df6cf8cc02afe0
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              memory: "400Mi"
              cpu: "200m"
            limits:
              memory: "800Mi"
              cpu: "300m"
          name: gateway-deployment
          ports: 
            - containerPort: 80
          envFrom:
          - configMapRef:
              name: gateway-cm

---

apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: gateway-hpa
  namespace: k8s-demo
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: gateway-deployment
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 70
EOF
```

Deploy Frontend:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: demo-frontend-cm
  namespace: k8s-demo
data:
  REACT_APP_BACKEND_URI: "http://localhost:9091/api/demo-backend"

---

apiVersion: v1
kind: Service
metadata:
  name: demo-frontend-deployment-service
  namespace: k8s-demo
  labels:
    app: demo-frontend-deployment
spec:
  type: ClusterIP
  ports:
    - port: 80
  selector:
    app: demo-frontend-deployment

---

apiVersion: apps/v1
kind: Deployment
metadata: 
  name: demo-frontend-deployment
  labels:        
    app: demo-frontend-deployment
  namespace: k8s-demo
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: demo-frontend-deployment
  template: 
    metadata:
      labels:        
        app: demo-frontend-deployment
    spec:
      containers:
        - image: cunal/demo-frontend:6685333069ec622c9c314b95f6df6cf8cc02afe0
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              memory: "50M"
              cpu: "10m"
            limits:
              memory: "70M"
              cpu: "50m"
          name: demo-frontend-deployment
          ports: 
            - containerPort: 80
          envFrom:
          - configMapRef:
              name: demo-frontend-cm

---

apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: demo-frontend-hpa
  namespace: k8s-demo
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: demo-frontend-deployment
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 70
EOF
```

Check everything working properly:

```bash
kubectl get pods -n k8s-demo  -w

NAME                                        READY   STATUS    RESTARTS   AGE
demo-backend-deployment-6c6f448fdc-lx292    1/1     Running   0          49s
demo-frontend-deployment-7c5f98db4d-2f5cj   1/1     Running   0          8m13s
gateway-deployment-6d4b86758d-tptgn         1/1     Running   0          2m51s
mongo-deployment-5696d5847b-bvckx           1/1     Running   0          17m
redis-0                                     1/1     Running   0          10m
```

Get the ClusterIP of the gateway:

```bash
kubectl get svc -n k8s-demo | grep gateway

NAME                               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)              AGE
gateway-deployment-service         ClusterIP   10.105.148.37   <none>        80/TCP               16m
```

We will use this `10.105.148.37` ClusterIP in order to send requests to our Backend service. Also we will generate some request load by using the following script in order to demonstrate Horizontal Pod Autoscaler:

```bash
for i in {1..100}; do
    curl 'http://10.105.148.37/api/demo-backend/customers' | jq
done
```

## Optional Deployment Using Single Script

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
demo-backend-deployment-7688c96859-qzj97    1/1     Running   0          28s
demo-frontend-deployment-844f4598c7-pbqd2   1/1     Running   0          28s
```

### Tear Down
To delete everything, you can execute the following command:

```bash
bash stop.sh --kubernetes
```
