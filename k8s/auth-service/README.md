# Auth Service - Déploiement Kubernetes

Ce répertoire contient les manifests Kubernetes pour déployer le service d'authentification (auth-service).

## 📋 Prérequis

- Cluster Kubernetes avec Traefik comme Ingress Controller
- cert-manager installé pour la gestion des certificats SSL
- kubectl configuré pour accéder au cluster
- Docker et buildx pour construire l'image multi-plateforme
- Accès à GitHub Container Registry (ghcr.io)

## 🗂️ Structure

```
k8s/auth-service/
├── namespace.yaml                    # Namespaces staging et production
├── configmap.yaml                    # Configuration de l'application
├── auth-service-deployment.yaml      # Deployment et Service
├── auth-service-ingress.yaml         # Ingress avec TLS
├── deploy.sh                         # Script de déploiement automatisé
└── README.md                         # Ce fichier
```

## 🚀 Déploiement rapide

### Option 1 : Utiliser le script de déploiement (recommandé)

```bash
# Déploiement avec le tag latest
./deploy.sh

# Déploiement avec un tag spécifique
./deploy.sh v1.0.0
```

Le script effectue automatiquement :
1. Build de l'image Docker pour linux/amd64
2. Push vers GitHub Container Registry
3. Application des manifests Kubernetes
4. Vérification du rollout

### Option 2 : Déploiement manuel

#### 1. Build et push de l'image Docker

```bash
cd ../../backend/auth-service

# Build pour linux/amd64 (architecture du serveur)
docker buildx build --platform linux/amd64 \
  -t ghcr.io/a-fleury-dev/shopifake/auth-service:latest \
  --push .
```

#### 2. Application des manifests

```bash
cd ../../k8s/auth-service

# Créer les namespaces
kubectl apply -f namespace.yaml

# Créer/mettre à jour le ConfigMap
kubectl apply -f configmap.yaml

# Déployer l'application
kubectl apply -f auth-service-deployment.yaml

# Configurer l'Ingress
kubectl apply -f auth-service-ingress.yaml
```

## 🔐 Configuration des secrets

### Secret pour GitHub Container Registry

Si ce n'est pas déjà fait, créer le secret pour accéder au registry :

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=VOTRE_USERNAME \
  --docker-password=VOTRE_GITHUB_TOKEN \
  --namespace=auth-service-prod
```

### Secret pour Keycloak (optionnel)

Si vous avez besoin de stocker le client secret de Keycloak :

```bash
kubectl create secret generic auth-service-secrets \
  --from-literal=keycloak-client-secret=VOTRE_SECRET \
  --namespace=auth-service-prod
```

## 📊 Vérification du déploiement

```bash
# Vérifier les pods
kubectl get pods -n auth-service-prod

# Vérifier les logs
kubectl logs -n auth-service-prod -l app=auth-service -f

# Vérifier le service
kubectl get svc -n auth-service-prod

# Vérifier l'ingress
kubectl get ingress -n auth-service-prod

# Vérifier le certificat SSL
kubectl get certificate -n auth-service-prod

# Status du déploiement
kubectl rollout status deployment/auth-service -n auth-service-prod
```

## 🌐 Accès au service

- **URL de production** : https://auth.shopifake.duckdns.org
- **Health check** : https://auth.shopifake.duckdns.org/actuator/health
- **Swagger UI** : https://auth.shopifake.duckdns.org/swagger-ui.html

## 🔧 Configuration

### Variables d'environnement

Les variables sont définies dans `configmap.yaml` :

- `SPRING_APPLICATION_NAME` : Nom de l'application
- `SERVER_PORT` : Port du serveur (8080)
- `KEYCLOAK_URL` : URL de Keycloak (interne au cluster)
- `KEYCLOAK_REALM` : Realm Keycloak (shopifake)
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` : URI de l'émetteur JWT
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI` : URI des clés publiques JWT

### Ressources

Par défaut, chaque pod utilise :
- **Requests** : 512Mi RAM, 250m CPU
- **Limits** : 1Gi RAM, 1000m CPU

### Haute disponibilité

Le déploiement crée 2 réplicas pour assurer la haute disponibilité.

## 🐛 Dépannage

### Problème de démarrage

```bash
# Voir les événements
kubectl describe pod -n auth-service-prod -l app=auth-service

# Voir les logs détaillés
kubectl logs -n auth-service-prod -l app=auth-service --all-containers=true
```

### Problème de certificat SSL

```bash
# Vérifier le certificat
kubectl describe certificate auth-service-tls -n auth-service-prod

# Forcer le renouvellement
kubectl delete certificate auth-service-tls -n auth-service-prod
kubectl apply -f auth-service-ingress.yaml
```

### Redémarrage des pods

```bash
kubectl rollout restart deployment/auth-service -n auth-service-prod
```

## 🔄 Mise à jour

Pour mettre à jour l'application :

```bash
# Avec le script (recommandé)
./deploy.sh v1.1.0

# Ou manuellement
kubectl set image deployment/auth-service \
  auth-service=ghcr.io/a-fleury-dev/shopifake/auth-service:v1.1.0 \
  -n auth-service-prod

# Suivre le rollout
kubectl rollout status deployment/auth-service -n auth-service-prod
```

## 🗑️ Suppression

```bash
# Supprimer le déploiement
kubectl delete -f auth-service-deployment.yaml
kubectl delete -f auth-service-ingress.yaml
kubectl delete -f configmap.yaml

# Supprimer le namespace (attention : supprime tout)
kubectl delete namespace auth-service-prod
```

## 📝 Notes

- Le service utilise les health checks Spring Boot Actuator
- Le certificat SSL est géré automatiquement par cert-manager et Let's Encrypt
- L'Ingress redirige automatiquement HTTP vers HTTPS
- Les logs sont disponibles via kubectl ou via un système de logging centralisé

