# Recommendation Service Kubernetes Configuration

This directory contains Kubernetes manifests for deploying the recommendation service.

## Files

- **namespace.yaml**: Creates `recommandation-staging` and `recommandation-prod` namespaces
- **configmap.yaml**: Configuration for Qdrant connection and service settings
- **recommandation-service-deployment.yaml**: Deployment and Service definitions

## Prerequisites

1. **OpenAI API Secret**: Create a secret with your OpenAI API key:
   ```bash
   kubectl create secret generic openai-secret \
     --from-literal=api-key=YOUR_OPENAI_API_KEY \
     --namespace=recommandation-staging
   
   kubectl create secret generic openai-secret \
     --from-literal=api-key=YOUR_OPENAI_API_KEY \
     --namespace=recommandation-prod
   ```

2. **Qdrant Service**: Ensure Qdrant is running in the `chatbot-staging` namespace and accessible at `qdrant-service.chatbot-staging:6333`

## Deployment

### Manual Deployment

```bash
# Create namespaces
kubectl apply -f namespace.yaml

# Deploy to staging
kubectl apply -f configmap.yaml -n recommandation-staging
kubectl apply -f recommandation-service-deployment.yaml -n recommandation-staging

# Deploy to production
# Update configmap.yaml to point to production Qdrant
kubectl apply -f configmap.yaml -n recommandation-prod
kubectl apply -f recommandation-service-deployment.yaml -n recommandation-prod
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n recommandation-staging

# Check service
kubectl get svc -n recommandation-staging

# View logs
kubectl logs -f deployment/recommandation-service -n recommandation-staging
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/recommendations` - Get recommendations (body: `{"product_id": "123"}` or `{"query": "red shoes"}`)
- `GET /api/v1/recommendations/product/{product_id}` - Get recommendations for a product
- `GET /api/v1/recommendations/search?q=query` - Search-based recommendations
- `GET /api/v1/products/{product_id}` - Get product details

## Environment Variables

Configured via ConfigMap:
- `QDRANT_URL`: URL to Qdrant service
- `QDRANT_COLLECTION`: Collection name in Qdrant
- `OPENAI_EMBED_MODEL`: OpenAI embedding model
- `MAX_RECOMMENDATIONS`: Maximum recommendations to return
- `DEFAULT_RECOMMENDATIONS`: Default number of recommendations
