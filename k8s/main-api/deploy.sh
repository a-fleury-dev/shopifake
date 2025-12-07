#!/bin/bash

# Script pour construire et déployer main-api sur Kubernetes
# Usage: ./deploy.sh [tag]

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
REGISTRY="ghcr.io/a-fleury-dev/shopifake"
IMAGE_NAME="main-api"
TAG="${1:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${GREEN}🚀 Déploiement de main-api${NC}"
echo "Image: ${FULL_IMAGE}"
echo ""

# 1. Build l'image pour AMD64 (plateforme du serveur)
echo -e "${YELLOW}📦 Construction de l'image Docker pour linux/amd64...${NC}"
cd ../../backend/main-api
docker buildx build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} --load .
docker tag ${IMAGE_NAME}:${TAG} ${FULL_IMAGE}
echo -e "${GREEN}✅ Image construite${NC}"
echo ""

# 2. Push vers le registry
echo -e "${YELLOW}⬆️  Push vers GitHub Container Registry...${NC}"
docker buildx build --platform linux/amd64 -t ${FULL_IMAGE} --push .
echo -e "${GREEN}✅ Image pushée${NC}"
echo ""

# 3. Retour au répertoire k8s
cd ../../k8s/main-api

# 4. Appliquer les manifests Kubernetes
echo -e "${YELLOW}☸️  Déploiement sur Kubernetes...${NC}"

# Vérifier/créer le secret pour GHCR si nécessaire
if ! kubectl get secret ghcr-secret -n shopifake-prod &> /dev/null; then
    echo -e "${RED}❌ Secret ghcr-secret non trouvé dans shopifake-prod${NC}"
    echo "Veuillez créer le secret ghcr-secret dans le namespace shopifake-prod"
    exit 1
fi

# Appliquer le ConfigMap
kubectl apply -f configmap.yaml

# Appliquer le Deployment
kubectl apply -f main-api-deployment.yaml

# Si le tag n'est pas latest, mettre à jour l'image
if [ "${TAG}" != "latest" ]; then
    echo -e "${YELLOW}🔄 Mise à jour de l'image vers ${TAG}...${NC}"
    kubectl set image deployment/main-api \
        main-api=${FULL_IMAGE} \
        -n shopifake-prod
fi

# Appliquer l'Ingress
kubectl apply -f main-api-ingress.yaml

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo -e "${YELLOW}📊 Statut du déploiement:${NC}"
kubectl rollout status deployment/main-api -n shopifake-prod --timeout=2m

echo ""
echo -e "${GREEN}🎉 main-api déployé avec succès !${NC}"
echo ""
echo -e "${YELLOW}🔍 Commandes utiles:${NC}"
echo "  Pods:         kubectl get pods -n shopifake-prod"
echo "  Logs:         kubectl logs -n shopifake-prod -l app=main-api -f"
echo "  Service:      kubectl get svc -n shopifake-prod"
echo "  Ingress:      kubectl get ingress -n shopifake-prod"
echo "  Certificate:  kubectl get certificate -n shopifake-prod"
echo ""
echo -e "${YELLOW}🌐 Accès:${NC}"
echo "  HTTP:  http://shopifake.duckdns.org/api"
echo "  HTTPS: https://shopifake.duckdns.org/api"
echo "  Health: https://shopifake.duckdns.org/api/actuator/health"
echo ""

