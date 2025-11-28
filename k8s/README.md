# Kubernetes Manifests

This directory contains all Kubernetes manifests for deploying the Recipe App.

## Files Overview

- `namespace.yaml`: Creates the `recipe-app` namespace
- `configmap.yaml`: Application configuration (non-sensitive)
- `secret.yaml`: Sensitive data (MongoDB URI, JWT secret, etc.)
- `mongodb-deployment.yaml`: MongoDB deployment, service, and PVC
- `backend-deployment.yaml`: Backend API deployment and service
- `frontend-deployment.yaml`: Frontend deployment and service
- `ingress.yaml`: Ingress configuration for external access
- `kustomization.yaml`: Kustomize configuration for managing all resources

## Quick Start

1. **Update Docker Hub username** in:
   - `backend-deployment.yaml`
   - `frontend-deployment.yaml`
   - `kustomization.yaml`

2. **Update secrets** in `secret.yaml`:
   ```yaml
   MONGODB_URI: "your-mongodb-uri"
   JWT_SECRET: "your-jwt-secret"
   ```

3. **Deploy**:
   ```bash
   kubectl apply -k .
   ```

## Architecture

```
Internet
   |
   v
[Ingress] (nginx)
   |
   +---> [Frontend Service] --> [Frontend Pods] (nginx serving React app)
   |
   +---> [Backend Service] --> [Backend Pods] (Node.js API)
                |
                v
         [MongoDB Service] --> [MongoDB Pod] (with PVC)
```

## Resource Requirements

### Minimum Requirements
- **Backend**: 256Mi memory, 250m CPU per pod
- **Frontend**: 128Mi memory, 100m CPU per pod
- **MongoDB**: 256Mi memory, 250m CPU

### Recommended for Production
- **Backend**: 512Mi memory, 500m CPU per pod (2+ replicas)
- **Frontend**: 256Mi memory, 200m CPU per pod (2+ replicas)
- **MongoDB**: 1Gi memory, 500m CPU (with persistent storage)

## Customization

### Change Replicas

Edit `backend-deployment.yaml` and `frontend-deployment.yaml`:
```yaml
spec:
  replicas: 3  # Change this number
```

### Change Resource Limits

Edit the `resources` section in deployment files:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Use External MongoDB

1. Update `secret.yaml` with external MongoDB URI
2. Remove or comment out `mongodb-deployment.yaml` from `kustomization.yaml`

### Configure Ingress with SSL

1. Install cert-manager
2. Uncomment TLS section in `ingress.yaml`
3. Update annotations for cert-manager

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n recipe-app
```

### View Pod Logs
```bash
kubectl logs -f <pod-name> -n recipe-app
```

### Describe Pod
```bash
kubectl describe pod <pod-name> -n recipe-app
```

### Check Services
```bash
kubectl get svc -n recipe-app
```

### Port Forward for Testing
```bash
# Frontend
kubectl port-forward svc/frontend-service 8080:80 -n recipe-app

# Backend
kubectl port-forward svc/backend-service 5000:5000 -n recipe-app

# MongoDB
kubectl port-forward svc/mongodb-service 27017:27017 -n recipe-app
```

