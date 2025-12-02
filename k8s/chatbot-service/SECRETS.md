# Configuration des Secrets Kubernetes

Ce document explique comment configurer les secrets pour le déploiement du chatbot service.

## Secrets GitHub requis

Le workflow CI/CD utilise des secrets GitHub pour déployer le chatbot service. Les secrets suivants doivent être configurés dans les paramètres du repository GitHub :

### 1. `OPENAI_API_KEY`
- **Description** : Clé API OpenAI pour le chatbot
- **Comment l'obtenir** : https://platform.openai.com/api-keys
- **Format** : `sk-...`

### 2. `KUBECONFIG_BASE64`
- **Description** : Configuration kubectl encodée en base64 pour accéder au cluster Kubernetes
- **Comment le créer** :
  ```bash
  cat ~/.kube/config | base64 -w 0
  ```

## Comment ajouter un secret GitHub

1. Allez sur https://github.com/a-fleury/shopifake/settings/secrets/actions
2. Cliquez sur "New repository secret"
3. Entrez le nom du secret (ex: `OPENAI_API_KEY`)
4. Collez la valeur du secret
5. Cliquez sur "Add secret"

## Secrets Kubernetes créés automatiquement

Le workflow CI/CD crée automatiquement les secrets suivants dans le cluster :

### `ghcr-secret`
- **Type** : docker-registry
- **Usage** : Authentification pour tirer les images Docker depuis GitHub Container Registry
- **Créé à partir de** : `GITHUB_TOKEN` (automatique)

### `chatbot-secret`
- **Type** : generic
- **Usage** : Variables d'environnement sensibles pour le chatbot
- **Créé à partir de** : 
  - `OPENAI_API_KEY` (depuis GitHub Secrets)

## Développement local

Pour tester localement avec les mêmes secrets :

```bash
# Créer le secret OpenAI
kubectl create secret generic chatbot-secret \
  --from-literal=OPENAI_API_KEY='sk-votre-clé-locale' \
  -n chatbot-staging

# Vérifier que le secret existe
kubectl get secrets -n chatbot-staging

# Redémarrer le déploiement pour prendre en compte les changements
kubectl rollout restart deployment/chatbot-service -n chatbot-staging
```

## Rotation des secrets

Pour mettre à jour un secret :

1. Mettez à jour le secret dans les paramètres GitHub
2. Relancez le workflow manuellement ou faites un push
3. Le secret sera automatiquement mis à jour dans Kubernetes

Ou manuellement :

```bash
kubectl create secret generic chatbot-secret \
  --from-literal=OPENAI_API_KEY='nouvelle-clé' \
  -n chatbot-staging \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl rollout restart deployment/chatbot-service -n chatbot-staging
```
