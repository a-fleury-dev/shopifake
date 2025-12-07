# 🔐 Gestion des Secrets Kubernetes

Ce guide explique comment créer et gérer les secrets nécessaires pour déployer Shopifake sur Kubernetes.

## Secrets Requis

### 1. ghcr-secret (GitHub Container Registry)
**Type:** docker-registry  
**Utilisé par:** Tous les services pour pull les images Docker

**Création manuelle:**
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  -n shopifake-prod
```

**Prérequis:**
- Personal Access Token GitHub avec les permissions `read:packages` et `write:packages`
- Créer un token : https://github.com/settings/tokens

### 2. openai-secret (OpenAI API)
**Type:** generic  
**Utilisé par:** chatbot-service, recommandation-service

**Création manuelle:**
```bash
kubectl create secret generic openai-secret \
  --from-literal=api-key=YOUR_OPENAI_API_KEY \
  -n shopifake-prod
```

**Prérequis:**
- Clé API OpenAI
- Obtenir une clé : https://platform.openai.com/api-keys

### 3. chatbot-secret (Qdrant Configuration)
**Type:** generic  
**Utilisé par:** chatbot-service

**Création manuelle:**
```bash
kubectl create secret generic chatbot-secret \
  --from-literal=qdrant-url=http://qdrant:6333 \
  --from-literal=qdrant-api-key=YOUR_QDRANT_API_KEY \
  -n shopifake-prod
```

**Note:** Si Qdrant n'utilise pas d'API key, vous pouvez omettre `qdrant-api-key`.

## 🚀 Création Rapide avec le Script

Un script interactif est disponible pour créer tous les secrets :

```bash
cd k8s
./create-secrets.sh
```

Le script :
- ✅ Vérifie les secrets existants
- 📝 Vous guide pour chaque secret manquant
- 🔒 Masque les informations sensibles lors de la saisie
- ✨ Crée ou met à jour les secrets

## 🔍 Vérification des Secrets

### Lister tous les secrets
```bash
kubectl get secrets -n shopifake-prod
```

### Vérifier un secret spécifique
```bash
kubectl describe secret ghcr-secret -n shopifake-prod
kubectl describe secret openai-secret -n shopifake-prod
kubectl describe secret chatbot-secret -n shopifake-prod
```

### Voir le contenu d'un secret (base64 encodé)
```bash
kubectl get secret openai-secret -n shopifake-prod -o yaml
```

### Décoder une valeur
```bash
kubectl get secret openai-secret -n shopifake-prod -o jsonpath='{.data.api-key}' | base64 -d
```

## 🗑️ Suppression des Secrets

### Supprimer un secret spécifique
```bash
kubectl delete secret ghcr-secret -n shopifake-prod
```

### Supprimer tous les secrets shopifake
```bash
kubectl delete secret ghcr-secret openai-secret chatbot-secret -n shopifake-prod
```

## 🔄 Mise à Jour des Secrets

Pour mettre à jour un secret :

1. Supprimer l'ancien secret
2. Recréer avec les nouvelles valeurs
3. Redémarrer les pods concernés

```bash
# Exemple pour openai-secret
kubectl delete secret openai-secret -n shopifake-prod

kubectl create secret generic openai-secret \
  --from-literal=api-key=NEW_API_KEY \
  -n shopifake-prod

# Redémarrer les pods
kubectl rollout restart deployment/chatbot-service -n shopifake-prod
kubectl rollout restart deployment/recommandation-service -n shopifake-prod
```

## 🔐 Bonnes Pratiques

### 1. Ne jamais committer les secrets
- ❌ Ne jamais ajouter de secrets dans Git
- ✅ Utiliser `.gitignore` pour les fichiers de secrets
- ✅ Utiliser des variables d'environnement ou des outils de gestion de secrets

### 2. Utiliser des secrets externes (recommandé pour production)
Pour un environnement de production, considérez :
- **External Secrets Operator** : Synchronise avec AWS Secrets Manager, HashiCorp Vault, etc.
- **Sealed Secrets** : Chiffre les secrets pour les stocker en toute sécurité dans Git
- **SOPS** : Chiffrement de fichiers de configuration

### 3. Rotation régulière
- 🔄 Changez vos secrets régulièrement
- 📅 Définissez une politique de rotation (ex: tous les 90 jours)
- 🔔 Configurez des alertes pour les secrets expirés

### 4. Principe du moindre privilège
- Créez des tokens/clés avec les permissions minimales nécessaires
- Utilisez des comptes de service dédiés

## 📚 Ressources

- [Kubernetes Secrets Documentation](https://kubernetes.io/docs/concepts/configuration/secret/)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [OpenAI API Keys](https://platform.openai.com/docs/api-reference/authentication)
- [External Secrets Operator](https://external-secrets.io/)

## 🆘 Dépannage

### "ImagePullBackOff" erreur
➡️ Vérifiez que `ghcr-secret` existe et est correct :
```bash
kubectl get secret ghcr-secret -n shopifake-prod
kubectl describe pod POD_NAME -n shopifake-prod
```

### Chatbot ne démarre pas
➡️ Vérifiez les secrets OpenAI et Qdrant :
```bash
kubectl logs -n shopifake-prod -l app=chatbot-service
kubectl get secret openai-secret chatbot-secret -n shopifake-prod
```

### Secret non trouvé
➡️ Vérifiez le namespace :
```bash
kubectl get secrets --all-namespaces | grep "ghcr-secret\|openai-secret\|chatbot-secret"
```

