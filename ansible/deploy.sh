#!/bin/bash

# Ansible Deployment Script
# This script helps deploy the Recipe App to Kubernetes using Ansible

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Recipe App - Ansible Deployment Script${NC}"
echo "=========================================="

# Check if ansible is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo -e "${RED}Error: ansible-playbook is not installed.${NC}"
    echo "Install it using: pip install ansible kubernetes"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed.${NC}"
    exit 1
fi

# Install Ansible collections if needed
echo -e "${YELLOW}Installing Ansible collections...${NC}"
ansible-galaxy collection install -r requirements.yml

# Run the playbook
echo -e "${YELLOW}Running Ansible playbook...${NC}"
ansible-playbook playbook.yml "$@"

echo -e "${GREEN}Deployment completed!${NC}"

