# Architecture Kubernetes - Shopifake

## Structure des Namespaces

Ce projet utilise une architecture de namespaces **par environnement** plutôt que par service.

### Namespaces

- `shopifake-prod` : Environnement de production (tous les services)
- `shopifake-staging` : Environnement de staging (tous les services)

### Avantages de cette approche

✅ **Simplicité** : Un seul namespace à gérer par environnement  
✅ **Communication inter-services** : Les services peuvent communiquer facilement sans configuration DNS complexe  
✅ **Ressources partagées** : ConfigMaps et Secrets peuvent être partagés facilement  
✅ **Isolation par environnement** : Production et staging sont complètement séparés

### Déploiement

#### 🚀 Déploiement Complet (Recommandé)

Le script `deploy.sh` à la racine déploie tous les services dans le bon ordre :

```bash
# Déployer tous les services avec le tag 'latest'
./deploy.sh

# Déployer tous les services avec un tag spécifique
./deploy.sh v1.0.0
```

**Ordre de déploiement automatique :**
1. Chatbot Service (avec Qdrant)
2. Recommandation Service (avec Qdrant)
3. Image Service (avec PostgreSQL + MinIO)
4. Keycloak (avec PostgreSQL)
5. Auth Service
6. Main API
7. Frontend

Le script effectue automatiquement :
- ✅ Vérification des prérequis (kubectl, docker, cluster)
- ✅ Création/vérification des namespaces
- ✅ Vérification des secrets nécessaires
- ✅ Build et push des images Docker
- ✅ Déploiement des dépendances (bases de données, Qdrant, etc.)
- ✅ Attente que chaque service soit prêt avant de passer au suivant
- ✅ Affichage du résumé et du temps total

#### 📦 Déploiement Manuel

1. **Créer les namespaces** :
   ```bash
   kubectl apply -f namespaces.yaml
   ```

2. **Déployer un service individuellement** (exemple avec auth-service) :
   ```bash
   cd auth-service
   ./deploy.sh
   # ou avec un tag spécifique
   ./deploy.sh v1.0.0
   ```

3. **Déployer manuellement dans l'ordre recommandé** :
   ```bash
   cd chatbot-service && ./deploy.sh && cd ..
   cd recommandation-service && ./deploy.sh && cd ..
   cd image-service && ./deploy.sh && cd ..
   cd keycloak && ./deploy.sh && cd ..
   cd auth-service && ./deploy.sh && cd ..
   cd main-api && ./deploy.sh && cd ..
   cd frontend && ./deploy.sh && cd ..
   ```

### Communication inter-services

Les services dans le même namespace peuvent communiquer directement :
```
http://auth-service:80
http://keycloak:8080
http://main-api:8080
http://chatbot-service:8080
http://recommandation-service:8080
http://image-service:8080
```

Pour les services avec DNS complet :
```
http://auth-service.shopifake-prod.svc.cluster.local:80
http://keycloak.shopifake-prod.svc.cluster.local:8080
```

### 🔐 Secrets Nécessaires

Avant le déploiement, créez les secrets suivants dans le namespace `shopifake-prod` :

#### 1. Secret GitHub Container Registry
```bash
kubectl create secret docker-registry ghcr-secret \
  --namespace=shopifake-prod \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL
```

#### 2. Secret Chatbot Service
```bash
kubectl create secret generic chatbot-secret \
  --namespace=shopifake-prod \
  --from-literal=OPENAI_API_KEY=YOUR_OPENAI_KEY \
  --from-literal=OTHER_VAR=value
```

#### 3. Secret OpenAI pour Recommandation
```bash
kubectl create secret generic openai-secret \
  --namespace=shopifake-prod \
  --from-literal=OPENAI_API_KEY=YOUR_OPENAI_KEY
```

Consultez les fichiers `SECRETS.md` dans chaque dossier de service pour plus de détails.

### 🌐 URLs d'Accès

Après déploiement, les services sont accessibles aux URLs suivantes :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | https://shopifake.duckdns.org | Interface utilisateur principale |
| **Main API** | https://shopifake.duckdns.org/api | API REST principale |
| **Auth Service** | https://auth.shopifake.duckdns.org | Service d'authentification |
| **Keycloak** | https://keycloak.shopifake.duckdns.org | Gestion des identités |
| **Image Service** | https://image.shopifake.duckdns.org | Service de gestion d'images |
| **Chatbot** | https://chatbot.shopifake.duckdns.org | Service de chatbot IA |
| **Recommandation** | https://reco.shopifake.duckdns.org | Service de recommandations |

### 🛠️ Scripts Utilitaires

#### `deploy.sh` - Déploiement complet
Déploie tous les services dans le bon ordre avec gestion automatique des dépendances.
```bash
./deploy.sh           # Tag 'latest'
./deploy.sh v1.0.0    # Tag spécifique
```

#### `check-status.sh` - Vérification de l'état
Affiche l'état de tous les déploiements, pods, services, ingress et certificats.
```bash
./check-status.sh
```

#### `cleanup.sh` - Nettoyage
Supprime tous les déploiements (⚠️ ATTENTION : opération irréversible).
```bash
./cleanup.sh
```

### Vérification

```bash
# Lister les namespaces
kubectl get namespaces | grep shopifake

# Lister tous les pods dans production
kubectl get pods -n shopifake-prod

# Lister tous les services dans production
kubectl get svc -n shopifake-prod

# Voir les ressources d'un service spécifique
kubectl get all -n shopifake-prod -l app=auth-service
```

### Services déployés

Dans chaque namespace, vous trouverez :

- **auth-service** : Service d'authentification
- **frontend** : Interface utilisateur React
- **keycloak** : Serveur d'identité et d'accès
- **main-api** : API principale
- **image-service** : Service de gestion d'images
- **chatbot-service** : Service de chatbot avec IA
- **recommandation-service** : Service de recommandations
- **qdrant** : Base de données vectorielle (pour chatbot et recommandations)
- **postgres** : Bases de données PostgreSQL (pour keycloak, image-service, main-api)
- **minio** : Stockage S3-compatible (pour image-service)
