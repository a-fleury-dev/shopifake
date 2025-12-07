#!/bin/bash

# Script de déploiement complet de Shopifake sur Kubernetes
# Usage: ./deploy.sh [tag]
# Exemple: ./deploy.sh v1.0.0 (pour utiliser le tag v1.0.0 pour tous les services)
#          ./deploy.sh (utilise 'latest' par défaut)

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables
TAG="${1:-latest}"
START_TIME=$(date +%s)

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        ███████╗██╗  ██╗ ██████╗ ██████╗ ██╗███████╗          ║
║        ██╔════╝██║  ██║██╔═══██╗██╔══██╗██║██╔════╝          ║
║        ███████╗███████║██║   ██║██████╔╝██║█████╗            ║
║        ╚════██║██╔══██║██║   ██║██╔═══╝ ██║██╔══╝            ║
║        ███████║██║  ██║╚██████╔╝██║     ██║██║               ║
║        ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝               ║
║                                                               ║
║             Déploiement Complet sur Kubernetes                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}Tag utilisé: ${YELLOW}${TAG}${NC}"
echo ""

# Fonction pour afficher le temps écoulé
function elapsed_time() {
    local END_TIME=$(date +%s)
    local ELAPSED=$((END_TIME - START_TIME))
    local MINUTES=$((ELAPSED / 60))
    local SECONDS=$((ELAPSED % 60))
    echo -e "${CYAN}⏱️  Temps écoulé: ${MINUTES}m ${SECONDS}s${NC}"
}

# Fonction pour déployer un service
function deploy_service() {
    local SERVICE_NAME=$1
    local SERVICE_PATH=$2
    local SERVICE_NUM=$3
    local TOTAL=$4

    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}[$SERVICE_NUM/$TOTAL] 🚀 Déploiement de ${YELLOW}${SERVICE_NAME}${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

    cd "${SERVICE_PATH}"

    if [ -f "deploy.sh" ]; then
        ./deploy.sh "${TAG}"
    else
        echo -e "${RED}❌ Fichier deploy.sh introuvable dans ${SERVICE_PATH}${NC}"
        exit 1
    fi

    cd - > /dev/null

    echo -e "${GREEN}✅ ${SERVICE_NAME} déployé avec succès${NC}"
    elapsed_time
}

# Vérification des prérequis
echo -e "${YELLOW}🔍 Vérification des prérequis...${NC}"

# Vérifier kubectl
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ kubectl installé${NC}"

# Vérifier docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ docker n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ docker installé${NC}"

# Vérifier la connexion au cluster
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Impossible de se connecter au cluster Kubernetes${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Connexion au cluster OK${NC}"

# Vérifier les namespaces
echo ""
echo -e "${YELLOW}📦 Vérification/Création des namespaces...${NC}"
if [ -f "namespaces.yaml" ]; then
    kubectl apply -f namespaces.yaml
    echo -e "${GREEN}✅ Namespaces créés/vérifiés${NC}"
else
    echo -e "${YELLOW}⚠️  Fichier namespaces.yaml introuvable, les namespaces doivent exister${NC}"
fi

# Vérifier les secrets nécessaires
echo ""
echo -e "${YELLOW}🔐 Vérification des secrets...${NC}"

MISSING_SECRETS=false

if ! kubectl get secret ghcr-secret -n shopifake-prod &> /dev/null; then
    echo -e "${RED}❌ Secret ghcr-secret manquant dans shopifake-prod${NC}"
    MISSING_SECRETS=true
fi

if ! kubectl get secret chatbot-secret -n shopifake-prod &> /dev/null; then
    echo -e "${RED}❌ Secret chatbot-secret manquant dans shopifake-prod${NC}"
    MISSING_SECRETS=true
fi

if ! kubectl get secret openai-secret -n shopifake-prod &> /dev/null; then
    echo -e "${RED}❌ Secret openai-secret manquant dans shopifake-prod${NC}"
    MISSING_SECRETS=true
fi

if [ "$MISSING_SECRETS" = true ]; then
    echo -e "${RED}⚠️  Des secrets sont manquants. Voulez-vous continuer quand même ? (y/N)${NC}"
    read -r RESPONSE
    if [[ ! "$RESPONSE" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Déploiement annulé${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Tous les secrets nécessaires sont présents${NC}"
fi

# Début du déploiement
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        DÉBUT DU DÉPLOIEMENT DES SERVICES                 ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL_SERVICES=7
CURRENT_SERVICE=0

# 1. Chatbot Service
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Chatbot Service" "chatbot-service" $CURRENT_SERVICE $TOTAL_SERVICES

# 2. Recommandation Service
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Recommandation Service" "recommandation-service" $CURRENT_SERVICE $TOTAL_SERVICES

# 3. Image Service
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Image Service" "image-service" $CURRENT_SERVICE $TOTAL_SERVICES

# 4. Keycloak
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Keycloak" "keycloak" $CURRENT_SERVICE $TOTAL_SERVICES

# 5. Auth Service
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Auth Service" "auth-service" $CURRENT_SERVICE $TOTAL_SERVICES

# 6. Main API
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Main API" "main-api" $CURRENT_SERVICE $TOTAL_SERVICES

# 7. Frontend
CURRENT_SERVICE=$((CURRENT_SERVICE + 1))
deploy_service "Frontend" "frontend" $CURRENT_SERVICE $TOTAL_SERVICES

# Résumé final
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ! 🎉           ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

elapsed_time

echo ""
echo -e "${YELLOW}📊 Récapitulatif des déploiements:${NC}"
echo ""
echo -e "  ${GREEN}✅${NC} Chatbot Service      → https://chatbot.shopifake.duckdns.org"
echo -e "  ${GREEN}✅${NC} Recommandation       → https://reco.shopifake.duckdns.org"
echo -e "  ${GREEN}✅${NC} Image Service        → https://image.shopifake.duckdns.org"
echo -e "  ${GREEN}✅${NC} Keycloak             → https://keycloak.shopifake.duckdns.org"
echo -e "  ${GREEN}✅${NC} Auth Service         → https://auth.shopifake.duckdns.org"
echo -e "  ${GREEN}✅${NC} Main API             → https://shopifake.duckdns.org/api"
echo -e "  ${GREEN}✅${NC} Frontend             → https://shopifake.duckdns.org"
echo ""

echo -e "${YELLOW}🔍 Commandes utiles pour vérifier l'état:${NC}"
echo ""
echo "  # Voir tous les pods"
echo "  kubectl get pods -n shopifake-prod"
echo ""
echo "  # Voir tous les services"
echo "  kubectl get svc -n shopifake-prod"
echo ""
echo "  # Voir tous les ingress"
echo "  kubectl get ingress -n shopifake-prod"
echo ""
echo "  # Voir tous les certificats"
echo "  kubectl get certificates -n shopifake-prod"
echo ""
echo "  # Voir les logs d'un service (exemple: main-api)"
echo "  kubectl logs -n shopifake-prod -l app=main-api -f"
echo ""

echo -e "${GREEN}🎊 Tous les services sont maintenant déployés et accessibles !${NC}"
echo ""

