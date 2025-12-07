#!/bin/bash

# Deploy Image Service to Kubernetes
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Image Service deployment..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Check if GitHub Container Registry secret exists
if ! kubectl get secret ghcr-secret -n shopifake-prod &> /dev/null; then
    echo "❌ Secret ghcr-secret not found in shopifake-prod"
    echo "Please create the secret first"
    exit 1
fi

# Deploy PostgreSQL
echo "🐘 Deploying PostgreSQL..."
kubectl apply -f postgres-deployment.yaml

# Deploy MinIO
echo "🗄️  Deploying MinIO..."
kubectl apply -f minio-deployment.yaml

# Wait for PostgreSQL and MinIO to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n shopifake-prod --timeout=60s

echo "⏳ Waiting for MinIO to be ready..."
kubectl wait --for=condition=ready pod -l app=minio -n shopifake-prod --timeout=60s

# Apply ConfigMap
echo "⚙️  Applying ConfigMap..."
kubectl apply -f configmap.yaml

# Deploy Image Service
echo "🖼️  Deploying Image Service..."
kubectl apply -f image-service-deployment.yaml

# Wait for Image Service to be ready
echo "⏳ Waiting for Image Service pods to be ready..."
kubectl wait --for=condition=ready pod -l app=image-service -n shopifake-prod --timeout=120s

# Deploy Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f image-service-ingress.yaml

# Wait for certificate to be ready
echo "🔒 Waiting for SSL certificate to be issued..."
kubectl wait --for=condition=ready certificate image-service-tls -n shopifake-prod --timeout=120s || echo "⚠️  Certificate not ready yet, it may take a few minutes..."

echo ""
echo "✅ Image Service deployment completed!"
echo ""
echo "📊 Deployment status:"
kubectl get all -n shopifake-prod
echo ""
echo "🔒 Certificate status:"
kubectl get certificate -n shopifake-prod
echo ""
echo "🌐 Ingress status:"
kubectl get ingress -n shopifake-prod
echo ""
echo "🎯 Image Service is accessible at: https://image.shopifake.duckdns.org"
echo ""
echo "💡 Useful commands:"
echo "  - View pods: kubectl get pods -n shopifake-prod -l app=image-service"
echo "  - View logs: kubectl logs -f -n shopifake-prod -l app=image-service"
echo "  - Restart: kubectl rollout restart deployment/image-service -n shopifake-prod"

