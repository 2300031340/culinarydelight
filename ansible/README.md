# Ansible Playbooks

This directory contains Ansible playbooks for automating the deployment of the Recipe App to Kubernetes.

## Prerequisites

1. **Install Ansible**
   ```bash
   pip install ansible kubernetes
   ```

2. **Install Ansible Collections**
   ```bash
   ansible-galaxy collection install -r requirements.yml
   ```

3. **Configure kubectl**
   - Ensure `kubectl` is installed and configured
   - Set the correct Kubernetes context

## Files

- `playbook.yml`: Main deployment playbook
- `inventory.yml`: Inventory file with environment configurations
- `requirements.yml`: Ansible collection dependencies
- `ansible.cfg`: Ansible configuration
- `deploy.sh`: Deployment script wrapper

## Configuration

### 1. Update Inventory

Edit `inventory.yml`:

```yaml
all:
  children:
    k8s_cluster:
      hosts:
        localhost:
          ansible_connection: local
          k8s_context: "your-k8s-context"  # Update this
          dockerhub_username: "YOUR_DOCKERHUB_USERNAME"  # Update this
          mongodb_uri: "mongodb://mongodb-service:27017/recipe-app"
          jwt_secret: "your-secret-key-here"
```

### 2. Update Playbook Variables

Edit `playbook.yml` if needed:

```yaml
vars:
  dockerhub_username: "YOUR_DOCKERHUB_USERNAME"
  namespace: "recipe-app"
  k8s_context: "your-k8s-context"
```

## Usage

### Quick Deploy

```bash
# Make script executable (Linux/Mac)
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

### With Custom Variables

```bash
ansible-playbook playbook.yml \
  -e "dockerhub_username=myusername" \
  -e "mongodb_uri=mongodb://my-mongodb:27017/recipe-app" \
  -e "jwt_secret=my-secret-key"
```

### Check Mode (Dry Run)

```bash
ansible-playbook playbook.yml --check
```

### Verbose Output

```bash
ansible-playbook playbook.yml -v  # -vv, -vvv for more verbosity
```

## What the Playbook Does

1. **Validates Prerequisites**
   - Checks if `kubectl` is installed
   - Sets Kubernetes context

2. **Creates Namespace**
   - Creates the `recipe-app` namespace

3. **Applies Configuration**
   - Creates ConfigMap with application settings
   - Creates Secret with sensitive data

4. **Deploys Services**
   - Deploys MongoDB
   - Waits for MongoDB to be ready
   - Deploys Backend
   - Deploys Frontend
   - Deploys Ingress

5. **Verifies Deployment**
   - Waits for all pods to be running
   - Displays deployment status

## Customization

### Add More Environments

Edit `inventory.yml`:

```yaml
all:
  children:
    production:
      hosts:
        prod-k8s:
          ansible_connection: local
          k8s_context: "production-cluster"
          dockerhub_username: "myusername"
          mongodb_uri: "mongodb://prod-mongodb:27017/recipe-app"
    
    development:
      hosts:
        dev-k8s:
          ansible_connection: local
          k8s_context: "dev-cluster"
          dockerhub_username: "myusername"
          mongodb_uri: "mongodb://dev-mongodb:27017/recipe-app"
```

### Add More Tasks

Edit `playbook.yml` to add additional tasks:

```yaml
- name: Your custom task
  kubernetes.core.k8s:
    # Your task definition
```

## Troubleshooting

### kubectl Not Found

```bash
# Install kubectl
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Mac
brew install kubectl
```

### Collection Not Found

```bash
ansible-galaxy collection install -r requirements.yml
```

### Permission Denied

```bash
chmod +x deploy.sh
```

### Kubernetes Context Not Set

```bash
# List contexts
kubectl config get-contexts

# Set context
kubectl config use-context your-context-name
```

## Best Practices

1. **Use Vault for Secrets**: Store sensitive data in Ansible Vault
2. **Version Control**: Keep playbooks in version control
3. **Test First**: Use `--check` mode before actual deployment
4. **Idempotency**: Playbooks should be idempotent (safe to run multiple times)
5. **Documentation**: Keep inventory and playbooks well-documented

## Advanced Usage

### Using Ansible Vault for Secrets

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Use in playbook
ansible-playbook playbook.yml --ask-vault-pass
```

### Tagged Execution

```yaml
# In playbook.yml, add tags
tasks:
  - name: Deploy MongoDB
    # ...
    tags: mongodb

  - name: Deploy Backend
    # ...
    tags: backend
```

Run specific tags:
```bash
ansible-playbook playbook.yml --tags "backend,frontend"
```

