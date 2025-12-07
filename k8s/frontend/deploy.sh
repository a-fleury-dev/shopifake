#!/bin/bash

# Script de déploiement du frontend sur Kubernetes
# Usage: ./deploy.sh [staging|prod]

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier l'environnement
ENVIRONMENT=${1:-prod}

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "prod" ]; then
    error "Environnement invalide. Utilisez 'staging' ou 'prod'"
    exit 1
fi

NAMESPACE="shopifake-${ENVIRONMENT}"

info "Déploiement dans l'environnement: $ENVIRONMENT"
info "Namespace: $NAMESPACE"

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    error "kubectl n'est pas installé. Installez-le d'abord !"
    exit 1
fi

# Vérifier la connexion au cluster
info "Vérification de la connexion au cluster..."
if ! kubectl cluster-info &> /dev/null; then
    error "Impossible de se connecter au cluster Kubernetes"
    exit 1
fi

info "✓ Connexion au cluster OK"

# Créer/Mettre à jour le ConfigMap
info "Application du ConfigMap..."
kubectl apply -f configmap.yaml -n $NAMESPACE

# Déployer l'application
info "Déploiement de l'application..."
kubectl apply -f frontend-deployment.yaml -n $NAMESPACE

# Attendre que les pods soient prêts
info "Attente du démarrage des pods..."
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=120s || {
    warn "Les pods mettent du temps à démarrer. Vérifiez avec: kubectl get pods -n $NAMESPACE"
}

# Afficher le statut
info "Statut du déploiement:"
kubectl get deployment frontend -n $NAMESPACE
echo ""

info "Statut des pods:"
kubectl get pods -n $NAMESPACE
echo ""

info "Statut du service:"
kubectl get service frontend -n $NAMESPACE
echo ""

# Obtenir l'URL d'accès
EXTERNAL_IP=$(kubectl get service frontend -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

if [ -z "$EXTERNAL_IP" ]; then
    warn "L'IP externe n'est pas encore attribuée. Attendez quelques instants et exécutez:"
    echo "kubectl get service frontend -n $NAMESPACE"
else
    info "✓ Déploiement réussi !"
    echo ""
    echo "🌐 Accédez à votre application sur: http://$EXTERNAL_IP:5173"
fi

echo ""
info "Commandes utiles:"
echo "  - Voir les logs: kubectl logs -l app=frontend -n $NAMESPACE"
echo "  - Voir les pods: kubectl get pods -n $NAMESPACE"
echo "  - Redémarrer: kubectl rollout restart deployment/frontend -n $NAMESPACE"

