# 🚀 Guide de démarrage rapide - Frontend Kubernetes

## Ce que vous devez faire EN PREMIER

### 1. Configurer kubectl (1 fois seulement)

```bash
# Créer le dossier
mkdir -p ~/.kube

# Copier votre config
cp /Users/alex/Polytech/S9/DevOps/shopifake/local/config ~/.kube/config

# Tester
kubectl get nodes
```

✅ Si vous voyez la liste de vos nœuds, c'est bon !

### 2. Préparer votre image Docker

**Option A : Image publique (plus simple pour débuter)**

```bash
cd /Users/alex/Polytech/S9/DevOps/shopifake/frontend

# Builder l'image
docker build -t VOTRE-USERNAME/shopifake-frontend:latest .

# Pousser sur Docker Hub
docker push VOTRE-USERNAME/shopifake-frontend:latest
```

Puis modifiez la ligne 20 de `frontend-deployment.yaml` :
```yaml
image: VOTRE-USERNAME/shopifake-frontend:latest
```

Et supprimez les lignes 16-17 (imagePullSecrets).

**Option B : Image privée GitHub**

```bash
# Builder
docker build -t ghcr.io/VOTRE-USERNAME/shopifake/frontend:latest .

# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u VOTRE-USERNAME --password-stdin

# Pousser
docker push ghcr.io/VOTRE-USERNAME/shopifake/frontend:latest

# Créer le secret dans Kubernetes
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=VOTRE-USERNAME \
  --docker-password=VOTRE-TOKEN \
  -n frontend-prod
```

### 3. Déployer (4 commandes simples)

```bash
# 1. Créer le namespace
kubectl apply -f k8s/frontend/namespace.yaml

# 2. Créer la config
kubectl apply -f k8s/frontend/configmap.yaml -n frontend-prod

# 3. Déployer l'app
kubectl apply -f k8s/frontend/frontend-deployment.yaml -n frontend-prod

# 4. Vérifier
kubectl get pods -n frontend-prod
```

### 4. Accéder à votre application

```bash
# Obtenir l'IP externe
kubectl get service frontend -n frontend-prod

# Attendez que EXTERNAL-IP ne soit plus <pending>
# Puis ouvrez : http://EXTERNAL-IP:5173
```

## 🆘 Problèmes courants

### "ImagePullBackOff"
➜ Votre image n'est pas accessible. Vérifiez l'URL de l'image et le secret.

### "CrashLoopBackOff"
➜ L'application plante au démarrage. Regardez les logs :
```bash
kubectl logs POD-NAME -n frontend-prod
```

### Les pods ne se créent pas
➜ Vérifiez qu'il y a assez de ressources :
```bash
kubectl describe pod POD-NAME -n frontend-prod
```

## 📞 Besoin d'aide ?

Consultez le fichier `README.md` complet dans ce dossier pour plus de détails !

