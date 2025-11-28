# 🚀 Quick Review Guide - 30 Minutes Setup

## ⚡ Step-by-Step Instructions

### STEP 1: Docker Hub Setup (2 minutes)

1. **Create Docker Hub account** (if you don't have one)
   - Go to https://hub.docker.com
   - Sign up for free account

2. **Create Access Token**
   - Login to Docker Hub
   - Click your profile → Account Settings → Security
   - Click "New Access Token"
   - Name it: `github-actions`
   - Copy the token (you'll need it in Step 2)

### STEP 2: GitHub Secrets Configuration (3 minutes)

1. **Go to your GitHub repository**
   - Navigate to: `Settings` → `Secrets and variables` → `Actions`

2. **Add two secrets:**
   - Click "New repository secret"
   - Name: `DOCKER_HUB_USERNAME`
     - Value: Your Docker Hub username
   - Click "New repository secret" again
   - Name: `DOCKER_HUB_TOKEN`
     - Value: The access token you created in Step 1

### STEP 3: Update Kubernetes Files (5 minutes)

#### 3.1 Update Docker Hub Username

**File: `k8s/backend-deployment.yaml`**
- Find line with: `image: YOUR_DOCKERHUB_USERNAME/recipe-app-backend:latest`
- Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username

**File: `k8s/frontend-deployment.yaml`**
- Find line with: `image: YOUR_DOCKERHUB_USERNAME/recipe-app-frontend:latest`
- Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username

**File: `k8s/kustomization.yaml`**
- Find the `images:` section
- Replace both instances of `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username

#### 3.2 Update Secrets

**File: `k8s/secret.yaml`**
- Update `MONGODB_URI`: `mongodb://mongodb-service:27017/recipe-app` (or your MongoDB URI)
- Update `JWT_SECRET`: Change to a strong secret key (e.g., generate with: `openssl rand -base64 32`)

### STEP 4: Test Docker Builds Locally (Optional - 5 minutes)

```bash
# Build backend
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/recipe-app-backend:latest .
docker push YOUR_DOCKERHUB_USERNAME/recipe-app-backend:latest

# Build frontend
cd ../frontend
docker build -t YOUR_DOCKERHUB_USERNAME/recipe-app-frontend:latest .
docker push YOUR_DOCKERHUB_USERNAME/recipe-app-frontend:latest
```

**OR** - Just push to GitHub and let GitHub Actions build them automatically!

### STEP 5: Trigger GitHub Actions (2 minutes)

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Add CI/CD and deployment configuration"
   git push origin main
   ```

2. **Verify GitHub Actions:**
   - Go to your GitHub repo → `Actions` tab
   - You should see "Build and Push Docker Images" workflow running
   - Wait for it to complete (both jobs should show green checkmarks)

### STEP 6: Kubernetes Deployment (10 minutes)

#### 6.1 Prerequisites Check

```bash
# Check kubectl is installed
kubectl version --client

# Check you're connected to a cluster
kubectl cluster-info

# List contexts (if you have multiple)
kubectl config get-contexts

# Set context if needed
kubectl config use-context YOUR_CONTEXT_NAME
```

#### 6.2 Deploy Everything

```bash
# Navigate to project root
cd "d:\cicd final"

# Deploy all Kubernetes resources
kubectl apply -k k8s/
```

#### 6.3 Verify Deployment

```bash
# Check all resources
kubectl get all -n recipe-app

# Check pods (wait until all show "Running")
kubectl get pods -n recipe-app

# Watch pods until ready (Ctrl+C to stop)
kubectl get pods -n recipe-app -w
```

**Expected output:**
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
mongodb-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
```

### STEP 7: Access Your Application (3 minutes)

#### Option A: Port Forward (Quick Test)

```bash
# Forward frontend to localhost:8080
kubectl port-forward svc/frontend-service 8080:80 -n recipe-app
```

Then open browser: `http://localhost:8080`

#### Option B: Get LoadBalancer IP

```bash
# Get external IP
kubectl get svc frontend-service -n recipe-app

# Look for EXTERNAL-IP (may take a few minutes to assign)
# Access via: http://EXTERNAL-IP
```

#### Option C: Ingress (If configured)

```bash
# Get ingress
kubectl get ingress -n recipe-app

# Access via the hostname configured in ingress.yaml
```

### STEP 8: Verify Everything Works (5 minutes)

1. **Check Backend Logs:**
   ```bash
   kubectl logs -f deployment/backend -n recipe-app
   ```
   Should see: "Server is running on port 5000" and "Connected to MongoDB"

2. **Check Frontend Logs:**
   ```bash
   kubectl logs -f deployment/frontend -n recipe-app
   ```
   Should see nginx logs

3. **Test API:**
   ```bash
   # Port forward backend
   kubectl port-forward svc/backend-service 5000:5000 -n recipe-app
   
   # In another terminal, test
   curl http://localhost:5000/
   ```
   Should return: `{"message":"Welcome to Recipe API"}`

4. **Test Frontend:**
   - Open browser to your frontend URL
   - Should see the recipe app homepage
   - Try navigating and using features

## 🎯 Quick Commands Reference

```bash
# View everything
kubectl get all -n recipe-app

# View logs
kubectl logs -f deployment/backend -n recipe-app
kubectl logs -f deployment/frontend -n recipe-app

# Check pod status
kubectl describe pod <pod-name> -n recipe-app

# Scale deployments
kubectl scale deployment backend --replicas=3 -n recipe-app

# Delete everything (if needed)
kubectl delete namespace recipe-app
```

## 🚨 Troubleshooting Quick Fixes

### Issue: Pods stuck in "ImagePullBackOff"
**Fix:** 
- Check Docker Hub username is correct in deployment files
- Verify images exist: `docker pull YOUR_USERNAME/recipe-app-backend:latest`
- Check image pull secrets if using private registry

### Issue: Pods stuck in "Pending"
**Fix:**
- Check cluster resources: `kubectl describe node`
- Check PVC: `kubectl get pvc -n recipe-app`

### Issue: Backend can't connect to MongoDB
**Fix:**
- Check MongoDB pod: `kubectl get pods -l app=mongodb -n recipe-app`
- Check MongoDB URI in secret: `kubectl get secret recipe-app-secrets -n recipe-app -o yaml`

### Issue: Frontend shows errors
**Fix:**
- Check backend is running: `kubectl get pods -l app=backend -n recipe-app`
- Check nginx config: `kubectl exec -it <frontend-pod> -n recipe-app -- cat /etc/nginx/conf.d/default.conf`

## 📋 Review Checklist

- [ ] Docker Hub account created
- [ ] GitHub secrets configured (DOCKER_HUB_USERNAME, DOCKER_HUB_TOKEN)
- [ ] Docker Hub username updated in all k8s files
- [ ] Secrets updated in k8s/secret.yaml
- [ ] GitHub Actions workflow completed successfully
- [ ] Kubernetes cluster accessible via kubectl
- [ ] All pods running (backend, frontend, mongodb)
- [ ] Frontend accessible via browser
- [ ] Backend API responding
- [ ] Application fully functional

## 🎤 What to Show in Review

1. **GitHub Actions**: Show the workflow running/completed
2. **Docker Hub**: Show the pushed images
3. **Kubernetes**: Show `kubectl get all -n recipe-app`
4. **Application**: Show the running app in browser
5. **Logs**: Show backend logs confirming MongoDB connection
6. **Architecture**: Explain the setup (Docker → K8s → Services)

## 💡 Quick Demo Script

```bash
# 1. Show GitHub Actions
echo "GitHub Actions workflow completed"

# 2. Show Kubernetes deployment
kubectl get all -n recipe-app

# 3. Show running pods
kubectl get pods -n recipe-app

# 4. Show services
kubectl get svc -n recipe-app

# 5. Show logs
kubectl logs deployment/backend -n recipe-app --tail=10

# 6. Port forward and show app
kubectl port-forward svc/frontend-service 8080:80 -n recipe-app
# Then open http://localhost:8080 in browser
```

## ⏱️ Time Breakdown

- Step 1-2: 5 minutes (Docker Hub + GitHub setup)
- Step 3: 5 minutes (Update files)
- Step 4: 5 minutes (Optional - local build)
- Step 5: 2 minutes (Push to GitHub)
- Step 6: 10 minutes (Kubernetes deployment)
- Step 7-8: 8 minutes (Access and verify)

**Total: ~30 minutes**

Good luck with your review! 🚀

