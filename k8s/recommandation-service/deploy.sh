#!/bin/bash

# Script pour construire et déployer recommandation-service sur Kubernetes
# Usage: ./deploy.sh [tag]

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
REGISTRY="ghcr.io/a-fleury-dev/shopifake"
IMAGE_NAME="recommandation-service"
TAG="${1:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${GREEN}🚀 Déploiement de recommandation-service${NC}"
echo "Image: ${FULL_IMAGE}"
echo ""

# 1. Build l'image pour AMD64 (plateforme du serveur)
echo -e "${YELLOW}📦 Construction de l'image Docker pour linux/amd64...${NC}"
cd ../../backend/recommandation-service
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
cd ../../k8s/recommandation-service

# 4. Appliquer les manifests Kubernetes
echo -e "${YELLOW}☸️  Déploiement sur Kubernetes...${NC}"

# Vérifier/créer le secret pour GHCR si nécessaire
if ! kubectl get secret ghcr-secret -n shopifake-prod &> /dev/null; then
    echo -e "${YELLOW}⚠️  Secret ghcr-secret non trouvé dans shopifake-prod${NC}"
    echo "Veuillez créer le secret ghcr-secret dans le namespace shopifake-prod"
    exit 1
fi

# Appliquer le ConfigMap
kubectl apply -f configmap.yaml

# Vérifier que le secret openai-secret existe
if ! kubectl get secret openai-secret -n shopifake-prod &> /dev/null; then
    echo -e "${RED}❌ Secret openai-secret non trouvé dans shopifake-prod${NC}"
    echo "Veuillez créer le secret openai-secret avec OPENAI_API_KEY"
    exit 1
fi

# Déployer Qdrant (doit être déployé en premier)
echo -e "${YELLOW}🗄️  Déploiement de Qdrant pour recommandation-service...${NC}"
kubectl apply -f qdrant-deployment.yaml

# Attendre que Qdrant soit prêt
echo -e "${YELLOW}⏳ Attente que Qdrant soit prêt...${NC}"
kubectl wait --for=condition=ready pod -l app=qdrant -n shopifake-prod --timeout=60s

# Appliquer le Deployment
echo -e "${YELLOW}💡 Déploiement du recommandation-service...${NC}"
kubectl apply -f recommandation-service-deployment.yaml

# Si le tag n'est pas latest, mettre à jour l'image
if [ "${TAG}" != "latest" ]; then
    echo -e "${YELLOW}🔄 Mise à jour de l'image vers ${TAG}...${NC}"
    kubectl set image deployment/recommandation-service \
        recommandation-service=${FULL_IMAGE} \
        -n shopifake-prod
fi

# Appliquer l'Ingress
kubectl apply -f recommandation-service-ingress.yaml

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo -e "${YELLOW}📊 Statut du déploiement:${NC}"
kubectl rollout status deployment/recommandation-service -n shopifake-prod --timeout=2m

echo ""
echo -e "${GREEN}🎉 recommandation-service déployé avec succès !${NC}"
echo ""
echo -e "${YELLOW}🔍 Commandes utiles:${NC}"
echo "  Pods:         kubectl get pods -n shopifake-prod -l app=recommandation-service"
echo "  Logs:         kubectl logs -n shopifake-prod -l app=recommandation-service -f"
echo "  Service:      kubectl get svc -n shopifake-prod recommandation-service"
echo "  Ingress:      kubectl get ingress -n shopifake-prod recommandation-service-ingress"
echo "  Certificate:  kubectl get certificate -n shopifake-prod recommandation-service-tls"
echo ""
echo -e "${YELLOW}🌐 Accès:${NC}"
echo "  HTTP:  http://reco.shopifake.duckdns.org"
echo "  HTTPS: https://reco.shopifake.duckdns.org"
echo "  Health: https://reco.shopifake.duckdns.org/health"
echo ""

