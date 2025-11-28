# 🚀 Push to GitHub & Deploy - Quick Steps

## Step 1: Verify Files Are Ready

Make sure you've updated:
- [ ] `k8s/backend-deployment.yaml` - Replace `YOUR_DOCKERHUB_USERNAME`
- [ ] `k8s/frontend-deployment.yaml` - Replace `YOUR_DOCKERHUB_USERNAME`
- [ ] `k8s/kustomization.yaml` - Replace `YOUR_DOCKERHUB_USERNAME`
- [ ] `k8s/secret.yaml` - Update MongoDB URI and JWT_SECRET

## Step 2: Push to GitHub

```bash
# Navigate to project directory
cd "d:\cicd final"

# Check what will be committed
git status

# Add all files
git add .

# Commit
git commit -m "Add CI/CD pipeline and Kubernetes deployment"

# Push to GitHub
git push origin main
```

**Note:** If your branch is called `master` instead of `main`, use:
```bash
git push origin master
```

## Step 3: Monitor GitHub Actions

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You should see "Build and Push Docker Images" workflow running
4. Wait for both jobs to complete:
   - ✅ Build and Push Backend Image
   - ✅ Build and Push Frontend Image

**This will take 5-10 minutes**

## Step 4: Verify Images in Docker Hub

1. Go to https://hub.docker.com
2. Check your repositories - you should see:
   - `recipe-app-backend`
   - `recipe-app-frontend`

## Step 5: Deploy to Kubernetes

Once GitHub Actions is complete:

```bash
# Deploy everything
kubectl apply -k k8s/

# Watch pods start
kubectl get pods -n recipe-app -w
```

Wait until all pods show "Running" status.

## Step 6: Access Your App

```bash
# Port forward frontend
kubectl port-forward svc/frontend-service 8080:80 -n recipe-app
```

Open browser: http://localhost:8080

## 🎯 Quick Commands Reference

```bash
# Check GitHub Actions status
# (Go to GitHub → Actions tab)

# Check deployment
kubectl get all -n recipe-app

# View logs
kubectl logs -f deployment/backend -n recipe-app
kubectl logs -f deployment/frontend -n recipe-app

# Check if images exist in Docker Hub
# (Go to hub.docker.com and check your repositories)
```

