# Quick Start Guide

## 🚀 Quick Deployment Steps

### 1. GitHub Actions Setup (5 minutes)

1. Go to your GitHub repository → Settings → Secrets → Actions
2. Add these secrets:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_TOKEN`: Your Docker Hub access token (create at hub.docker.com)

3. Push to main branch - images will be built and pushed automatically!

### 2. Update Kubernetes Manifests (2 minutes)

Replace `YOUR_DOCKERHUB_USERNAME` in:
- `k8s/backend-deployment.yaml` (line with `image:`)
- `k8s/frontend-deployment.yaml` (line with `image:`)
- `k8s/kustomization.yaml` (in `images:` section)

### 3. Update Secrets (1 minute)

Edit `k8s/secret.yaml`:
```yaml
MONGODB_URI: "mongodb://mongodb-service:27017/recipe-app"
JWT_SECRET: "your-strong-secret-key-here"
```

### 4. Deploy to Kubernetes (1 command)

```bash
kubectl apply -k k8s/
```

### 5. Access Your App

```bash
# Get the service URL
kubectl get svc frontend-service -n recipe-app

# Or port forward for local access
kubectl port-forward svc/frontend-service 8080:80 -n recipe-app
# Then open http://localhost:8080
```

## 🎯 Using Ansible (Alternative)

```bash
cd ansible

# 1. Update inventory.yml with your details
# 2. Install collections
ansible-galaxy collection install -r requirements.yml

# 3. Deploy
ansible-playbook playbook.yml
```

## 📋 Checklist

- [ ] Docker Hub account created
- [ ] GitHub secrets configured
- [ ] Docker Hub username updated in k8s manifests
- [ ] Secrets updated in k8s/secret.yaml
- [ ] kubectl configured and connected to cluster
- [ ] Kubernetes cluster ready
- [ ] Images pushed to Docker Hub (via GitHub Actions or manually)

## 🔧 Common Commands

```bash
# Check deployment status
kubectl get all -n recipe-app

# View logs
kubectl logs -f deployment/backend -n recipe-app
kubectl logs -f deployment/frontend -n recipe-app

# Scale deployments
kubectl scale deployment backend --replicas=3 -n recipe-app

# Delete everything
kubectl delete namespace recipe-app
```

## 📚 More Information

- Full deployment guide: See `DEPLOYMENT.md`
- Kubernetes details: See `k8s/README.md`
- Ansible details: See `ansible/README.md`

