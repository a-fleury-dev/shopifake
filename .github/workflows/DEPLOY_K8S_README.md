# Deploy to Kubernetes - Reusable Workflow

Workflow réutilisable pour déployer des services Python sur Kubernetes.

## Usage

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy-k8s.yml
    with:
      service-name: chatbot-service
      k8s-manifests-path: k8s/chatbot-service
      namespace-staging: chatbot-staging
      namespace-production: chatbot-prod
      deployments: chatbot-service,qdrant
    secrets:
      KUBECONFIG_BASE64: ${{ secrets.KUBECONFIG_BASE64 }}
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Inputs

### Required

- **`service-name`** (string)
  - Nom du service à déployer
  - Exemple: `chatbot-service`, `recommandation-service`

- **`k8s-manifests-path`** (string)
  - Chemin vers le dossier contenant les manifests Kubernetes
  - Exemple: `k8s/chatbot-service`

- **`namespace-staging`** (string)
  - Namespace Kubernetes pour l'environnement staging
  - Exemple: `chatbot-staging`

- **`namespace-production`** (string)
  - Namespace Kubernetes pour l'environnement production
  - Exemple: `chatbot-prod`

- **`deployments`** (string)
  - Liste séparée par des virgules des noms de déploiements à attendre
  - Exemple: `chatbot-service,qdrant`

### Optional

- **`environment`** (string, default: `staging`)
  - Environnement cible (utilisé uniquement pour workflow_dispatch)
  - Valeurs: `staging` ou `production`

## Secrets

### Required

- **`KUBECONFIG_BASE64`**
  - Configuration kubectl encodée en base64
  - Comment générer:
    ```bash
    cat ~/.kube/config | base64 -w 0
    ```

### Optional

- **`OPENAI_API_KEY`**
  - Clé API OpenAI (uniquement si le service en a besoin)
  - Créé automatiquement comme secret Kubernetes si fourni

## Fonctionnalités

### 1. Détermination automatique du namespace
- Branche `main` → namespace production
- Autres branches (`staging`, `develop`) → namespace staging
- Workflow manuel → selon l'input `environment`

### 2. Gestion des secrets Kubernetes
- **ghcr-secret**: Créé automatiquement pour tirer les images Docker
- **{service-name}-secret**: Créé si `OPENAI_API_KEY` est fourni

### 3. Mise à jour automatique des tags d'image
- Remplace `:latest` par `:${COMMIT_SHA}` dans tous les déploiements
- Garantit la traçabilité des déploiements

### 4. Attente des rollouts
- Attend que tous les déploiements spécifiés soient complètement déployés
- Timeout: 5 minutes par déploiement

### 5. Résumé du déploiement
- Affiche les services et pods déployés
- Résumé avec namespace, trigger, branche et commit

## Structure attendue des manifests

Le dossier de manifests doit contenir:

```
k8s/{service-name}/
├── namespace.yaml              # Optionnel
├── configmap.yaml             # Optionnel
├── *-deployment.yaml          # Un ou plusieurs fichiers de déploiement
└── autres-manifests.yaml      # Services, PVC, etc.
```

## Exemple complet

```yaml
name: Mon Service - CI/CD

on:
  push:
    branches: [staging, main]

jobs:
  build:
    uses: ./.github/workflows/build-python.yml
    with:
      service-path: backend/mon-service
      service-name: mon-service

  deploy:
    needs: build
    if: needs.build.result == 'success'
    uses: ./.github/workflows/deploy-k8s.yml
    with:
      service-name: mon-service
      k8s-manifests-path: k8s/mon-service
      namespace-staging: mon-service-staging
      namespace-production: mon-service-prod
      deployments: mon-service
    secrets:
      KUBECONFIG_BASE64: ${{ secrets.KUBECONFIG_BASE64 }}
```

## Notes

- Le workflow utilise `kubectl apply -f {path}/ --recursive` pour appliquer tous les manifests
- Les namespaces et configmaps sont appliqués en premier
- Le workflow vérifie la connexion au cluster avant le déploiement
