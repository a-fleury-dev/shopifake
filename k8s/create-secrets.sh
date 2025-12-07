#!/bin/bash

# Script pour créer les secrets nécessaires dans les namespaces Kubernetes
# Usage: ./create-secrets.sh [--auto] [--force]
#   --auto : Mode automatique, crée tous les secrets manquants sans confirmation
#   --force : Force la recréation des secrets existants

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="shopifake-prod"
AUTO_MODE=false
FORCE_MODE=false

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --auto)
            AUTO_MODE=true
            shift
            ;;
        --force)
            FORCE_MODE=true
            shift
            ;;
        *)
            echo "Usage: $0 [--auto] [--force]"
            echo "  --auto  : Mode automatique, crée tous les secrets manquants sans confirmation"
            echo "  --force : Force la recréation des secrets existants"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🔐 Configuration des secrets pour Kubernetes${NC}"
echo -e "${YELLOW}Namespace: ${NAMESPACE}${NC}"
echo ""

# Vérification des variables d'environnement
echo -e "${BLUE}🔍 Vérification des variables d'environnement...${NC}"
echo ""

if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}✅ GITHUB_TOKEN détecté${NC}"
else
    echo -e "${YELLOW}⚠️  GITHUB_TOKEN non défini (nécessaire pour ghcr-secret)${NC}"
fi

if [ -n "$OPENAI_API_KEY" ]; then
    echo -e "${GREEN}✅ OPENAI_API_KEY détecté${NC}"
else
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY non défini (nécessaire pour openai-secret)${NC}"
fi

echo ""

# Fonction pour créer un secret Docker Registry
create_ghcr_secret() {
    echo -e "${YELLOW}📦 Configuration du secret GitHub Container Registry (ghcr-secret)${NC}"
    echo ""

    # Vérifier que GITHUB_TOKEN est défini dans l'environnement
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}❌ Variable d'environnement GITHUB_TOKEN non définie${NC}"
        echo "Veuillez définir : export GITHUB_TOKEN=<votre_token>"
        echo ""
        echo "Créer un PAT : https://github.com/settings/tokens"
        echo "Permissions nécessaires : read:packages, write:packages"
        return 1
    fi

    echo "✓ GITHUB_TOKEN détecté depuis l'environnement"
    echo ""

    # En mode auto, utiliser un username par défaut depuis git ou demander
    if [ "$AUTO_MODE" = true ]; then
        GITHUB_USERNAME=$(git config user.name 2>/dev/null || echo "")
        if [ -z "$GITHUB_USERNAME" ]; then
            GITHUB_USERNAME="a-fleury-dev"  # Fallback
        fi
        echo "Mode automatique: utilisation du username: $GITHUB_USERNAME"
    else
        read -p "Username GitHub : " GITHUB_USERNAME
    fi
    echo ""

    if [ -z "$GITHUB_USERNAME" ]; then
        echo -e "${RED}❌ Username manquant${NC}"
        return 1
    fi

    kubectl create secret docker-registry ghcr-secret \
        --docker-server=ghcr.io \
        --docker-username="$GITHUB_USERNAME" \
        --docker-password="$GITHUB_TOKEN" \
        --docker-email="${GITHUB_USERNAME}@users.noreply.github.com" \
        -n "$NAMESPACE" \
        --dry-run=client -o yaml | kubectl apply -f -

    echo -e "${GREEN}✅ Secret ghcr-secret créé${NC}"
    echo ""
}

# Fonction pour créer le secret OpenAI
create_openai_secret() {
    echo -e "${YELLOW}🤖 Configuration du secret OpenAI (openai-secret)${NC}"
    echo ""

    # Vérifier que OPENAI_API_KEY est défini dans l'environnement
    if [ -z "$OPENAI_API_KEY" ]; then
        echo -e "${RED}❌ Variable d'environnement OPENAI_API_KEY non définie${NC}"
        echo "Veuillez définir : export OPENAI_API_KEY=<votre_clé>"
        return 1
    fi

    echo "✓ OPENAI_API_KEY détecté depuis l'environnement"
    echo ""

    kubectl create secret generic openai-secret \
        --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY" \
        -n "$NAMESPACE" \
        --dry-run=client -o yaml | kubectl apply -f -

    echo -e "${GREEN}✅ Secret openai-secret créé${NC}"
    echo ""
}

# Fonction pour créer le secret Chatbot
create_chatbot_secret() {
    echo -e "${YELLOW}💬 Configuration du secret Chatbot (chatbot-secret)${NC}"
    echo ""
    echo "Pour créer ce secret, vous avez besoin de :"
    echo "  - L'URL de Qdrant"
    echo "  - La clé API Qdrant (optionnelle)"
    echo ""

    read -p "URL Qdrant [http://qdrant:6333] : " QDRANT_URL
    QDRANT_URL=${QDRANT_URL:-http://qdrant:6333}

    read -sp "Clé API Qdrant (laisser vide si non utilisée) : " QDRANT_API_KEY
    echo ""

    if [ -z "$QDRANT_URL" ]; then
        echo -e "${RED}❌ URL Qdrant manquante${NC}"
        return 1
    fi

    if [ -z "$QDRANT_API_KEY" ]; then
        kubectl create secret generic chatbot-secret \
            --from-literal=qdrant-url="$QDRANT_URL" \
            -n "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
    else
        kubectl create secret generic chatbot-secret \
            --from-literal=qdrant-url="$QDRANT_URL" \
            --from-literal=qdrant-api-key="$QDRANT_API_KEY" \
            -n "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
    fi

    echo -e "${GREEN}✅ Secret chatbot-secret créé${NC}"
    echo ""
}

# Vérifier les secrets existants
echo -e "${BLUE}🔍 Vérification des secrets existants...${NC}"
echo ""

GHCR_EXISTS=$(kubectl get secret ghcr-secret -n "$NAMESPACE" 2>/dev/null >/dev/null && echo "true" || echo "false")
OPENAI_EXISTS=$(kubectl get secret openai-secret -n "$NAMESPACE" 2>/dev/null >/dev/null && echo "true" || echo "false")
CHATBOT_EXISTS=$(kubectl get secret chatbot-secret -n "$NAMESPACE" 2>/dev/null >/dev/null && echo "true" || echo "false")

if [ "$GHCR_EXISTS" = "true" ]; then
    echo -e "${GREEN}✅ ghcr-secret existe déjà${NC}"
else
    echo -e "${RED}❌ ghcr-secret manquant${NC}"
fi

if [ "$OPENAI_EXISTS" = "true" ]; then
    echo -e "${GREEN}✅ openai-secret existe déjà${NC}"
else
    echo -e "${RED}❌ openai-secret manquant${NC}"
fi

if [ "$CHATBOT_EXISTS" = "true" ]; then
    echo -e "${GREEN}✅ chatbot-secret existe déjà${NC}"
else
    echo -e "${RED}❌ chatbot-secret manquant${NC}"
fi

echo ""
echo -e "${YELLOW}──────────────────────────────────────${NC}"
echo ""

# Créer les secrets manquants ou mettre à jour si --force
if [ "$GHCR_EXISTS" = "false" ] || [ "$FORCE_MODE" = true ]; then
    if [ "$GHCR_EXISTS" = "true" ] && [ "$FORCE_MODE" = true ]; then
        echo -e "${YELLOW}⚠️  ghcr-secret existe, recréation en mode --force${NC}"
    fi
    if [ "$AUTO_MODE" = true ] || [ "$FORCE_MODE" = true ]; then
        create_ghcr_secret
    else
        read -p "Créer ghcr-secret ? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_ghcr_secret
        fi
    fi
fi

if [ "$OPENAI_EXISTS" = "false" ] || [ "$FORCE_MODE" = true ]; then
    if [ "$OPENAI_EXISTS" = "true" ] && [ "$FORCE_MODE" = true ]; then
        echo -e "${YELLOW}⚠️  openai-secret existe, recréation en mode --force${NC}"
    fi
    if [ "$AUTO_MODE" = true ] || [ "$FORCE_MODE" = true ]; then
        create_openai_secret
    else
        read -p "Créer openai-secret ? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_openai_secret
        fi
    fi
fi

if [ "$CHATBOT_EXISTS" = "false" ]; then
    if [ "$AUTO_MODE" = false ]; then
        read -p "Créer chatbot-secret ? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_chatbot_secret
        fi
    fi
fi

echo ""
echo -e "${BLUE}📊 Résumé des secrets dans ${NAMESPACE}:${NC}"
kubectl get secrets -n "$NAMESPACE" | grep -E "(ghcr-secret|openai-secret|chatbot-secret)" || echo "Aucun secret trouvé"

echo ""
echo -e "${GREEN}✨ Configuration terminée !${NC}"

