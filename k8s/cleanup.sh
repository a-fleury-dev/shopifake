#!/bin/bash

# Script pour nettoyer/supprimer tous les déploiements Shopifake
# Usage: ./cleanup.sh
# ATTENTION: Ce script supprime TOUS les services déployés !

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║            ⚠️  NETTOYAGE DES DÉPLOIEMENTS ⚠️               ║${NC}"
echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠️  Ce script va supprimer TOUS les services Shopifake !${NC}"
echo -e "${YELLOW}⚠️  Cette action est IRRÉVERSIBLE !${NC}"
echo ""
echo -e "${RED}Voulez-vous vraiment continuer ? (tapez 'yes' pour confirmer)${NC}"
read -r CONFIRMATION

if [ "$CONFIRMATION" != "yes" ]; then
    echo -e "${GREEN}Opération annulée${NC}"
    exit 0
fi

NAMESPACE="shopifake-prod"

echo ""
echo -e "${YELLOW}🗑️  Suppression des déploiements dans $NAMESPACE...${NC}"
echo ""

# Liste des services à supprimer (dans l'ordre inverse du déploiement)
SERVICES=(
    "frontend"
    "main-api"
    "auth-service"
    "keycloak"
    "image-service"
    "recommandation-service"
    "chatbot-service"
)

# Supprimer les ingress
echo -e "${YELLOW}🌐 Suppression des Ingress...${NC}"
for service in "${SERVICES[@]}"; do
    if [ -d "$service" ]; then
        cd "$service"
        if ls *-ingress.yaml 1> /dev/null 2>&1; then
            kubectl delete -f *-ingress.yaml --ignore-not-found=true
            echo -e "${GREEN}✅${NC} Ingress $service supprimé"
        fi
        cd ..
    fi
done
echo ""

# Supprimer les déploiements
echo -e "${YELLOW}📦 Suppression des Deployments...${NC}"
for service in "${SERVICES[@]}"; do
    if [ -d "$service" ]; then
        cd "$service"
        if ls *-deployment.yaml 1> /dev/null 2>&1; then
            kubectl delete -f *-deployment.yaml --ignore-not-found=true
            echo -e "${GREEN}✅${NC} Deployment $service supprimé"
        fi
        cd ..
    fi
done
echo ""

# Supprimer les services Kubernetes
echo -e "${YELLOW}🔌 Suppression des Services...${NC}"
kubectl delete svc --all -n $NAMESPACE --ignore-not-found=true
echo -e "${GREEN}✅${NC} Tous les services supprimés"
echo ""

# Supprimer les ConfigMaps
echo -e "${YELLOW}⚙️  Suppression des ConfigMaps...${NC}"
kubectl delete configmap --all -n $NAMESPACE --ignore-not-found=true
echo -e "${GREEN}✅${NC} Tous les ConfigMaps supprimés"
echo ""

# Supprimer les PVC
echo -e "${YELLOW}💾 Suppression des PersistentVolumeClaims...${NC}"
kubectl delete pvc --all -n $NAMESPACE --ignore-not-found=true
echo -e "${GREEN}✅${NC} Tous les PVC supprimés"
echo ""

# Supprimer les certificats
echo -e "${YELLOW}🔒 Suppression des Certificats...${NC}"
kubectl delete certificate --all -n $NAMESPACE --ignore-not-found=true
echo -e "${GREEN}✅${NC} Tous les certificats supprimés"
echo ""

# Option pour supprimer les secrets (demander confirmation)
echo -e "${YELLOW}🔐 Voulez-vous aussi supprimer les secrets ? (y/N)${NC}"
read -r DELETE_SECRETS

if [[ "$DELETE_SECRETS" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Suppression des secrets...${NC}"
    kubectl delete secret --all -n $NAMESPACE --ignore-not-found=true
    echo -e "${GREEN}✅${NC} Tous les secrets supprimés"
else
    echo -e "${BLUE}ℹ️${NC}  Secrets conservés"
fi
echo ""

# Option pour supprimer le namespace
echo -e "${YELLOW}🗂️  Voulez-vous supprimer le namespace $NAMESPACE ? (y/N)${NC}"
read -r DELETE_NAMESPACE

if [[ "$DELETE_NAMESPACE" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Suppression du namespace...${NC}"
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    echo -e "${GREEN}✅${NC} Namespace $NAMESPACE supprimé"
else
    echo -e "${BLUE}ℹ️${NC}  Namespace conservé"
fi
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              NETTOYAGE TERMINÉ                            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Tous les services ont été supprimés${NC}"
echo ""

# Afficher ce qui reste
echo -e "${YELLOW}📊 État actuel du namespace $NAMESPACE:${NC}"
if kubectl get namespace $NAMESPACE &> /dev/null; then
    kubectl get all -n $NAMESPACE
else
    echo -e "${BLUE}ℹ️${NC}  Namespace supprimé"
fi
echo ""

