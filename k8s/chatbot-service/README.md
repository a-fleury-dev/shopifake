# Déploiement Kubernetes - Chatbot Service

## Architecture de déploiement

Le chatbot-service est déployé sur Kubernetes dans un namespace dédié `chatbot-test` pour l'environnement de staging.

### Composants déployés

1. **Ollama** - Service LLM pour les embeddings et l'inférence
2. **Qdrant** - Base de données vectorielle
3. **Chatbot API** - Service FastAPI principal

## Déploiement automatique

### Trigger du déploiement

Le déploiement automatique se déclenche lorsque vous pushez sur la branche `staging` avec des modifications dans:
- `backend/chatbot-service/**`
- `k8s/chatbot-service/**`
- `.github/workflows/chatbot-deploy-staging.yml`

### Processus de déploiement

1. **Build & Push**: Construction de l'image Docker et push vers GitHub Container Registry
2. **Deploy**: Déploiement sur Kubernetes avec kubectl
3. **Rollout**: Mise à jour progressive des pods
4. **Tests**: Smoke tests pour valider le déploiement

## Configuration requise

### Secrets GitHub

Assurez-vous que ces secrets sont configurés dans votre repository GitHub:

- `KUBECONFIG`: Votre fichier kubeconfig encodé en base64

Pour encoder votre kubeconfig:

**Linux/Mac:**
```bash
cat ~/.kube/config | base64 -w 0
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$HOME\.kube\config"))
```

### Permissions GitHub

Le workflow nécessite les permissions suivantes:
- `contents: read` - Pour lire le code
- `packages: write` - Pour pusher les images Docker

## Structure des manifestes Kubernetes

```
k8s/chatbot-service/
├── namespace.yaml              # Namespace chatbot-test
├── configmap.yaml              # Configuration (URLs Ollama/Qdrant)
├── ollama-deployment.yaml      # Déploiement Ollama + PVC
├── qdrant-deployment.yaml      # Déploiement Qdrant + PVC
└── chatbot-api-deployment.yaml # Déploiement API + LoadBalancer
```

## Déploiement manuel

Si vous souhaitez déployer manuellement:

```bash
# 1. Configurer kubectl
export KUBECONFIG=~/.kube/config

# 2. Créer le namespace
kubectl apply -f k8s/chatbot-service/namespace.yaml

# 3. Appliquer la configuration
kubectl apply -f k8s/chatbot-service/configmap.yaml

# 4. Déployer les services
kubectl apply -f k8s/chatbot-service/ollama-deployment.yaml
kubectl apply -f k8s/chatbot-service/qdrant-chat-deployment.yaml
kubectl apply -f k8s/chatbot-service/chatbot-api-deployment.yaml

# 5. Vérifier le déploiement
kubectl get pods -n chatbot-test
kubectl get services -n chatbot-test
```

## Accès aux services

### Obtenir l'IP externe du LoadBalancer

```bash
kubectl get service chatbot-api-service -n chatbot-test
```

### Port-forward pour tester localement

```bash
kubectl port-forward -n chatbot-test service/chatbot-api-service 8080:8080
```

Puis accédez à: http://localhost:8080

## Monitoring

### Vérifier les logs

```bash
# Logs du chatbot-api
kubectl logs -n chatbot-test -l app=chatbot-api --tail=100 -f

# Logs d'Ollama
kubectl logs -n chatbot-test -l app=ollama --tail=100 -f

# Logs de Qdrant
kubectl logs -n chatbot-test -l app=qdrant --tail=100 -f
```

### Status des pods

```bash
kubectl get pods -n chatbot-test -w
```

### Status des déploiements

```bash
kubectl get deployments -n chatbot-test
kubectl rollout status deployment/chatbot-api -n chatbot-test
```

## Scaling

### Scaler le chatbot-api

```bash
# Augmenter à 5 réplicas
kubectl scale deployment chatbot-api -n chatbot-test --replicas=5

# Ou modifier directement le fichier yaml et réappliquer
```

## Rollback

En cas de problème avec un déploiement:

```bash
# Voir l'historique
kubectl rollout history deployment/chatbot-api -n chatbot-test

# Revenir à la version précédente
kubectl rollout undo deployment/chatbot-api -n chatbot-test

# Revenir à une révision spécifique
kubectl rollout undo deployment/chatbot-api -n chatbot-test --to-revision=2
```

## Troubleshooting

### Les pods ne démarrent pas

```bash
# Voir les événements
kubectl get events -n chatbot-test --sort-by='.lastTimestamp'

# Décrire le pod problématique
kubectl describe pod <pod-name> -n chatbot-test

# Voir les logs
kubectl logs <pod-name> -n chatbot-test
```

### Ollama ne charge pas le modèle

```bash
# Se connecter au pod Ollama
kubectl exec -it -n chatbot-test <ollama-pod-name> -- bash

# Lister les modèles
ollama list

# Charger le modèle manuellement
ollama pull nomic-embed-text
```

### Problèmes de connectivité entre services

```bash
# Tester depuis un pod
kubectl run -it --rm debug --image=busybox -n chatbot-test -- sh

# Dans le pod, tester la connectivité
wget -O- http://ollama-service:11434
wget -O- http://qdrant-service:6333
wget -O- http://chatbot-api-service:8080
```

## Nettoyage

Pour supprimer complètement le déploiement:

```bash
kubectl delete namespace chatbot-test
```

Cela supprimera tous les pods, services, deployments, et PVCs du namespace.

## Ressources allouées

### Chatbot API
- Requests: 256Mi RAM, 250m CPU
- Limits: 512Mi RAM, 500m CPU
- Réplicas: 2

### Ollama
- Requests: 2Gi RAM, 1000m CPU
- Limits: 4Gi RAM, 2000m CPU
- Storage: 10Gi PVC

### Qdrant
- Requests: 512Mi RAM, 500m CPU
- Limits: 2Gi RAM, 1000m CPU
- Storage: 5Gi PVC

## Workflow CI/CD

Le workflow GitHub Actions effectue automatiquement:

1. ✅ Build de l'image Docker
2. ✅ Push vers GitHub Container Registry
3. ✅ Connexion au cluster Kubernetes
4. ✅ Création du namespace
5. ✅ Déploiement des services
6. ✅ Rollout progressif
7. ✅ Chargement des modèles Ollama
8. ✅ Smoke tests
9. ✅ Rapport de déploiement

Consultez l'onglet "Actions" dans GitHub pour voir l'état des déploiements.
