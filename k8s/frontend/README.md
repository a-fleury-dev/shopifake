# Déploiement du Frontend sur Kubernetes

## 📋 Prérequis

1. Avoir accès à votre cluster Kubernetes (vous avez déjà le fichier `config`)
2. Avoir `kubectl` installé sur votre machine
3. Avoir buildé et poussé votre image Docker dans un registry (GitHub Container Registry, Docker Hub, etc.)

## 🔧 Configuration de kubectl

Copiez votre fichier de configuration Kubernetes :

```bash
# Créez le dossier .kube s'il n'existe pas
mkdir -p ~/.kube

# Copiez votre fichier config
cp /Users/alex/Polytech/S9/DevOps/shopifake/local/config ~/.kube/config

# Vérifiez que ça fonctionne
kubectl get nodes
```

## 🏗️ Construction et push de l'image Docker

Avant de déployer sur Kubernetes, vous devez construire votre image Docker et la pousser vers un registry :

```bash
# Depuis le dossier frontend/
cd /Users/alex/Polytech/S9/DevOps/shopifake/frontend

# Construire l'image (remplacez par votre nom d'utilisateur GitHub)
docker build -t ghcr.io/VOTRE-USERNAME/shopifake/frontend:latest .

# Se connecter à GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u VOTRE-USERNAME --password-stdin

# Pousser l'image
docker push ghcr.io/VOTRE-USERNAME/shopifake/frontend:latest
```

**Important** : Mettez à jour la ligne 20 du fichier `frontend-deployment.yaml` avec votre URL d'image.

## 🚀 Déploiement (Étape par Étape)

### Étape 1 : Créer le namespace

```bash
kubectl apply -f k8s/frontend/namespace.yaml
```

Cela crée les espaces `frontend-staging` et `frontend-prod`.

### Étape 2 : Créer le Secret pour accéder au registry (si nécessaire)

Si votre image Docker est privée, créez un secret :

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=VOTRE-USERNAME \
  --docker-password=VOTRE-TOKEN \
  --docker-email=VOTRE-EMAIL \
  -n frontend-prod
```

Si votre image est publique, supprimez les lignes 16-17 du fichier `frontend-deployment.yaml`.

### Étape 3 : Créer le ConfigMap

```bash
kubectl apply -f k8s/frontend/configmap.yaml -n frontend-prod
```

### Étape 4 : Déployer l'application

```bash
kubectl apply -f k8s/frontend/frontend-deployment.yaml -n frontend-prod
```

## 🔍 Vérification du déploiement

### Vérifier les pods

```bash
kubectl get pods -n frontend-prod
```

Vous devriez voir 2 pods avec le statut `Running`.

### Vérifier les logs

```bash
# Remplacez POD-NAME par le nom d'un de vos pods
kubectl logs POD-NAME -n frontend-prod
```

### Vérifier le service

```bash
kubectl get service -n frontend-prod
```

Vous verrez une `EXTERNAL-IP`. C'est l'adresse pour accéder à votre application !

### Accéder à l'application

Une fois que vous avez l'IP externe :

```
http://EXTERNAL-IP:5173
```

## 🔄 Mise à jour de l'application

Quand vous avez des modifications à déployer :

```bash
# 1. Rebuilder et pousser l'image avec un nouveau tag
docker build -t ghcr.io/VOTRE-USERNAME/shopifake/frontend:v1.1 .
docker push ghcr.io/VOTRE-USERNAME/shopifake/frontend:v1.1

# 2. Mettre à jour le deployment
kubectl set image deployment/frontend frontend=ghcr.io/VOTRE-USERNAME/shopifake/frontend:v1.1 -n frontend-prod

# Ou simplement redémarrer les pods si vous utilisez :latest
kubectl rollout restart deployment/frontend -n frontend-prod
```

## 🛠️ Commandes utiles

```bash
# Voir tous les pods
kubectl get pods -n frontend-prod

# Voir les détails d'un pod
kubectl describe pod POD-NAME -n frontend-prod

# Se connecter à un pod
kubectl exec -it POD-NAME -n frontend-prod -- sh

# Voir les logs en temps réel
kubectl logs -f POD-NAME -n frontend-prod

# Supprimer le déploiement
kubectl delete -f k8s/frontend/frontend-deployment.yaml -n frontend-prod

# Voir tous les services
kubectl get services -n frontend-prod
```

## 🐛 Dépannage

### Les pods ne démarrent pas

```bash
kubectl describe pod POD-NAME -n frontend-prod
```

Vérifiez la section "Events" pour voir les erreurs.

### Erreur "ImagePullBackOff"

- Vérifiez que votre image existe dans le registry
- Vérifiez que le secret `ghcr-secret` est correct
- Si l'image est publique, supprimez la section `imagePullSecrets`

### L'application ne répond pas

```bash
# Vérifier les logs
kubectl logs POD-NAME -n frontend-prod

# Vérifier si le port est correct
kubectl port-forward POD-NAME 5173:5173 -n frontend-prod
```

Puis ouvrez http://localhost:5173 dans votre navigateur.

## 📝 Notes importantes

1. **Les URLs des services** : Dans Kubernetes, les services communiquent entre eux via leur nom de service. Par exemple, `http://main-api:5001` trouvera automatiquement le service `main-api` dans le même namespace.

2. **Les namespaces** : Assurez-vous que tous vos services backend sont déployés dans le même namespace ou ajustez les URLs en conséquence (ex: `http://main-api.main-api-prod.svc.cluster.local:5001`).

3. **Les ressources** : Ajustez les `resources.requests` et `resources.limits` selon les besoins réels de votre application.

4. **Le type LoadBalancer** : Cela fonctionne bien sur des clusters cloud (AWS, GCP, Azure, K3s). Si vous êtes sur un cluster local, utilisez `type: NodePort` à la place.

