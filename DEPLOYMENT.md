# Deployment Guide

This guide covers deploying the Recipe App using Docker, Kubernetes, and Ansible.

## Prerequisites

1. **Docker Hub Account**
   - Create an account at https://hub.docker.com
   - Create a Docker Hub access token (Settings > Security > New Access Token)

2. **Kubernetes Cluster**
   - Minikube (local development)
   - GKE, EKS, AKS (cloud)
   - Or any Kubernetes cluster

3. **Tools Required**
   - Docker
   - kubectl
   - Ansible (for automation)
   - Git

## 1. GitHub Actions Setup

### Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Your Docker Hub access token

### Workflow Behavior

The GitHub Actions workflow (`.github/workflows/docker-build-push.yml`) will:
- Build Docker images for both frontend and backend on push to main/master/develop
- Push images to Docker Hub with tags (branch name, SHA, latest)
- Use Docker layer caching for faster builds

## 2. Docker Images

### Build Locally

```bash
# Backend
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/recipe-app-backend:latest .

# Frontend
cd frontend
docker build -t YOUR_DOCKERHUB_USERNAME/recipe-app-frontend:latest .
```

### Push to Docker Hub

```bash
docker login
docker push YOUR_DOCKERHUB_USERNAME/recipe-app-backend:latest
docker push YOUR_DOCKERHUB_USERNAME/recipe-app-frontend:latest
```

## 3. Kubernetes Deployment

### Update Configuration

1. **Update Docker Hub username** in Kubernetes manifests:
   ```bash
   # Replace YOUR_DOCKERHUB_USERNAME in:
   - k8s/backend-deployment.yaml
   - k8s/frontend-deployment.yaml
   - k8s/kustomization.yaml
   ```

2. **Update secrets** in `k8s/secret.yaml`:
   ```yaml
   MONGODB_URI: "your-mongodb-connection-string"
   JWT_SECRET: "your-jwt-secret-key"
   ```

3. **Update ingress host** in `k8s/ingress.yaml`:
   ```yaml
   - host: your-domain.com
   ```

### Deploy to Kubernetes

#### Option 1: Using kubectl

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# Create secrets (update values first!)
kubectl apply -f k8s/secret.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy Ingress
kubectl apply -f k8s/ingress.yaml

# Or apply all at once
kubectl apply -f k8s/
```

#### Option 2: Using Kustomize

```bash
# Update k8s/kustomization.yaml with your Docker Hub username
kubectl apply -k k8s/
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n recipe-app

# Check services
kubectl get svc -n recipe-app

# Check ingress
kubectl get ingress -n recipe-app

# View logs
kubectl logs -f deployment/backend -n recipe-app
kubectl logs -f deployment/frontend -n recipe-app
```

### Access the Application

- **With LoadBalancer**: Get external IP from `kubectl get svc frontend-service -n recipe-app`
- **With Ingress**: Access via the configured domain
- **Port Forward** (for testing):
  ```bash
  kubectl port-forward svc/frontend-service 8080:80 -n recipe-app
  # Access at http://localhost:8080
  ```

## 4. Ansible Automation

### Install Ansible

```bash
pip install ansible kubernetes
```

### Install Ansible Collections

```bash
cd ansible
ansible-galaxy collection install -r requirements.yml
```

### Configure Inventory

Edit `ansible/inventory.yml`:
- Update `dockerhub_username`
- Update `k8s_context` with your Kubernetes context
- Update `mongodb_uri` and `jwt_secret`

### Run Deployment

```bash
cd ansible

# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh
./deploy.sh

# Or run directly
ansible-playbook playbook.yml
```

### Deploy to Specific Environment

```bash
# Production
ansible-playbook playbook.yml -i inventory.yml --limit production

# Staging
ansible-playbook playbook.yml -i inventory.yml --limit staging
```

## 5. Environment Variables

### Backend Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (production/development)

### Frontend Environment Variables

- `VITE_API_URL`: Backend API URL (optional, defaults to relative path)

## 6. Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n recipe-app

# Check events
kubectl get events -n recipe-app --sort-by='.lastTimestamp'
```

### Image Pull Errors

- Verify Docker Hub credentials
- Check image name and tag in deployment manifests
- Ensure images are pushed to Docker Hub

### MongoDB Connection Issues

- Verify MongoDB service is running: `kubectl get pods -l app=mongodb -n recipe-app`
- Check MongoDB URI in secrets
- Verify network policies allow connection

### Frontend Can't Reach Backend

- Check backend service: `kubectl get svc backend-service -n recipe-app`
- Verify nginx proxy configuration in `frontend/nginx.conf`
- Check ingress configuration

## 7. Scaling

### Scale Deployments

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n recipe-app

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n recipe-app
```

### Horizontal Pod Autoscaler

Create `k8s/hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: recipe-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 8. Monitoring and Logs

### View Logs

```bash
# All pods
kubectl logs -f -l app=backend -n recipe-app
kubectl logs -f -l app=frontend -n recipe-app

# Specific pod
kubectl logs -f <pod-name> -n recipe-app
```

### Resource Usage

```bash
kubectl top pods -n recipe-app
kubectl top nodes
```

## 9. Cleanup

```bash
# Delete all resources
kubectl delete namespace recipe-app

# Or delete individually
kubectl delete -f k8s/
```

## 10. Production Considerations

1. **Secrets Management**: Use sealed-secrets, external-secrets, or cloud secret managers
2. **SSL/TLS**: Configure cert-manager for automatic certificate management
3. **Monitoring**: Set up Prometheus and Grafana
4. **Logging**: Use ELK stack or cloud logging services
5. **Backup**: Regular MongoDB backups
6. **Resource Limits**: Adjust CPU/memory limits based on load
7. **Network Policies**: Implement network policies for security
8. **RBAC**: Configure proper role-based access control

