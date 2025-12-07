#!/bin/bash

# Script de vérification de l'état du déploiement Shopifake
# Usage: ./check-status.sh

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       VÉRIFICATION DE L'ÉTAT DU DÉPLOIEMENT              ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

NAMESPACE="shopifake-prod"

# Vérifier si le namespace existe
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    echo -e "${RED}❌ Le namespace $NAMESPACE n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Namespace $NAMESPACE trouvé${NC}"
echo ""

# Liste des services à vérifier
declare -A SERVICES=(
    ["chatbot-service"]="Chatbot Service"
    ["recommandation-service"]="Recommandation Service"
    ["image-service"]="Image Service"
    ["keycloak"]="Keycloak"
    ["auth-service"]="Auth Service"
    ["main-api"]="Main API"
    ["frontend"]="Frontend"
)

# Vérifier les pods
echo -e "${YELLOW}📦 État des Pods:${NC}"
echo ""

for service in "${!SERVICES[@]}"; do
    NAME="${SERVICES[$service]}"
    PODS=$(kubectl get pods -n $NAMESPACE -l app=$service --no-headers 2>/dev/null | wc -l)
    READY=$(kubectl get pods -n $NAMESPACE -l app=$service --no-headers 2>/dev/null | grep "Running" | wc -l)

    if [ $PODS -eq 0 ]; then
        echo -e "  ${RED}❌${NC} $NAME: Aucun pod trouvé"
    elif [ $PODS -eq $READY ]; then
        echo -e "  ${GREEN}✅${NC} $NAME: $READY/$PODS pods prêts"
    else
        echo -e "  ${YELLOW}⚠️${NC}  $NAME: $READY/$PODS pods prêts"
    fi
done

echo ""

# Vérifier les services
echo -e "${YELLOW}🔌 Services:${NC}"
echo ""
kubectl get svc -n $NAMESPACE -o wide
echo ""

# Vérifier les ingress
echo -e "${YELLOW}🌐 Ingress:${NC}"
echo ""
kubectl get ingress -n $NAMESPACE
echo ""

# Vérifier les certificats
echo -e "${YELLOW}🔒 Certificats TLS:${NC}"
echo ""
kubectl get certificates -n $NAMESPACE
echo ""

# Vérifier les PVC
echo -e "${YELLOW}💾 Persistent Volume Claims:${NC}"
echo ""
kubectl get pvc -n $NAMESPACE
echo ""

# Résumé des URLs
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                 URLs D'ACCÈS                              ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}🌐${NC} Frontend:          https://shopifake.duckdns.org"
echo -e "  ${BLUE}🔧${NC} Main API:          https://shopifake.duckdns.org/api"
echo -e "  ${BLUE}🔐${NC} Auth Service:      https://auth.shopifake.duckdns.org"
echo -e "  ${BLUE}🔑${NC} Keycloak:          https://keycloak.shopifake.duckdns.org"
echo -e "  ${BLUE}🖼️${NC}  Image Service:     https://image.shopifake.duckdns.org"
echo -e "  ${BLUE}🤖${NC} Chatbot:           https://chatbot.shopifake.duckdns.org"
echo -e "  ${BLUE}💡${NC} Recommandation:    https://reco.shopifake.duckdns.org"
echo ""

# Commandes utiles
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              COMMANDES UTILES                             ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  # Voir les logs d'un service (exemple: main-api)"
echo "  kubectl logs -n $NAMESPACE -l app=main-api -f"
echo ""
echo "  # Redémarrer un déploiement"
echo "  kubectl rollout restart deployment/main-api -n $NAMESPACE"
echo ""
echo "  # Voir les événements récents"
echo "  kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp'"
echo ""
echo "  # Ouvrir un shell dans un pod"
echo "  kubectl exec -it -n $NAMESPACE <pod-name> -- /bin/sh"
echo ""

