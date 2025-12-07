# Image Service Kubernetes Deployment

Ce répertoire contient les fichiers de configuration Kubernetes pour déployer le **Image Service** en production.

## 📋 Prérequis

- Cluster Kubernetes opérationnel
- `kubectl` configuré pour accéder au cluster
- Cert-manager installé pour les certificats SSL
- Traefik comme Ingress Controller
- GitHub Container Registry secret (`ghcr-secret`) configuré

## 🏗️ Architecture

Le déploiement comprend :

- **Namespace** : `image-service-prod`
- **PostgreSQL** : Base de données pour les métadonnées d'images
- **MinIO** : Stockage d'objets pour les fichiers images
- **Image Service** : 2 réplicas pour haute disponibilité
- **Ingress** : Avec certificat SSL Let's Encrypt
- **URL** : `https://image.shopifake.duckdns.org`

## 🚀 Déploiement rapide

### Option 1 : Script automatique (recommandé)

```bash
./deploy.sh
```

### Option 2 : Déploiement manuel

```bash
# 1. Créer le namespace
kubectl apply -f namespace.yaml

# 2. Copier le secret GitHub Container Registry
kubectl get secret ghcr-secret -n main-api-prod -o yaml | \
    sed 's/namespace: main-api-prod/namespace: image-service-prod/' | \
    kubectl apply -f -

# 3. Déployer PostgreSQL
kubectl apply -f postgres-deployment.yaml

# 4. Déployer MinIO
kubectl apply -f minio-deployment.yaml

# 5. Attendre que PostgreSQL et MinIO soient prêts
kubectl wait --for=condition=ready pod -l app=postgres -n image-service-prod --timeout=120s
kubectl wait --for=condition=ready pod -l app=minio -n image-service-prod --timeout=120s

# 6. Appliquer le ConfigMap
kubectl apply -f configmap.yaml

# 7. Déployer le service
kubectl apply -f image-service-deployment.yaml

# 8. Déployer l'Ingress
kubectl apply -f image-service-ingress.yaml
```

## 📦 Fichiers de configuration

### `namespace.yaml`
Définit le namespace Kubernetes pour l'isolation des ressources.

### `postgres-deployment.yaml`
Déploie PostgreSQL avec :
- PersistentVolumeClaim de 5Gi
- Base de données : `image_service`
- Utilisateur : `user` / Mot de passe : `pwd`
- Health checks configurés

### `minio-deployment.yaml`
Déploie MinIO avec :
- PersistentVolumeClaim de 10Gi
- Credentials : `minioadmin` / `minioadmin`
- Console accessible sur port 9001
- API sur port 9000

### `configmap.yaml`
Variables d'environnement pour l'application :
- Configuration Spring Boot
- Connexion PostgreSQL
- Configuration MinIO
- Bucket : `shopifake-images-prod`

### `image-service-deployment.yaml`
Déploiement du service avec :
- 2 réplicas pour haute disponibilité
- Limites de ressources configurées
- Image : `ghcr.io/a-fleury-dev/shopifake/image-service:latest`

### `image-service-ingress.yaml`
Configuration Ingress avec :
- Host : `image.shopifake.duckdns.org`
- Certificat SSL automatique (Let's Encrypt)
- Redirection HTTP → HTTPS

## 🔍 Vérification

```bash
# Voir tous les pods
kubectl get pods -n image-service-prod

# Voir les services
kubectl get services -n image-service-prod

# Voir l'ingress
kubectl get ingress -n image-service-prod

# Vérifier le certificat SSL
kubectl get certificate -n image-service-prod

# Voir les logs du service
kubectl logs -f -n image-service-prod -l app=image-service

# Voir les logs de PostgreSQL
kubectl logs -n image-service-prod -l app=postgres

# Voir les logs de MinIO
kubectl logs -n image-service-prod -l app=minio
```

## 🔧 Maintenance

### Redémarrer le service

```bash
kubectl rollout restart deployment/image-service -n image-service-prod
```

### Mettre à jour l'image

```bash
# Rebuild et push l'image Docker
cd ../../backend/image-service
docker buildx build --platform linux/amd64 \
    -t ghcr.io/a-fleury-dev/shopifake/image-service:latest \
    --push .

# Redémarrer le déploiement
kubectl rollout restart deployment/image-service -n image-service-prod
```

### Scaler le service

```bash
# Augmenter le nombre de réplicas
kubectl scale deployment/image-service -n image-service-prod --replicas=3

# Diminuer le nombre de réplicas
kubectl scale deployment/image-service -n image-service-prod --replicas=1
```

## 🗑️ Suppression

```bash
# Supprimer tous les composants
kubectl delete namespace image-service-prod

# ⚠️ Attention : Cela supprimera aussi les données PostgreSQL et MinIO !
```

## 🌐 Accès au service

- **API** : `https://image.shopifake.duckdns.org`
- **Console MinIO** : Accessible via port-forward
  ```bash
  kubectl port-forward -n image-service-prod svc/minio 9001:9001
  # Puis ouvrir http://localhost:9001
  ```

## 📊 Monitoring

```bash
# Surveiller les pods en temps réel
kubectl get pods -n image-service-prod -w

# Voir les événements
kubectl get events -n image-service-prod --sort-by='.lastTimestamp'

# Voir l'utilisation des ressources
kubectl top pods -n image-service-prod
```

## 🐛 Dépannage

### Les pods ne démarrent pas

```bash
# Voir les événements du pod
kubectl describe pod -n image-service-prod <pod-name>

# Voir les logs
kubectl logs -n image-service-prod <pod-name>
```

### Problème de connexion à PostgreSQL

```bash
# Vérifier que PostgreSQL est prêt
kubectl get pods -n image-service-prod -l app=postgres

# Tester la connexion depuis un pod
kubectl exec -it -n image-service-prod <image-service-pod> -- sh
# Puis dans le pod : nc -zv postgres 5432
```

### Problème de connexion à MinIO

```bash
# Vérifier que MinIO est prêt
kubectl get pods -n image-service-prod -l app=minio

# Voir les logs de MinIO
kubectl logs -n image-service-prod -l app=minio
```

### Le certificat SSL ne s'émet pas

```bash
# Vérifier les certificats
kubectl get certificate -n image-service-prod
kubectl describe certificate image-service-tls -n image-service-prod

# Vérifier cert-manager
kubectl get pods -n cert-manager

# Voir les logs de cert-manager
kubectl logs -n cert-manager -l app=cert-manager
```

## 🔐 Sécurité

### Secrets

Les secrets sensibles sont stockés dans des objets Kubernetes Secret :
- `postgres-secret` : Credentials PostgreSQL
- `minio-secret` : Credentials MinIO
- `ghcr-secret` : Credentials GitHub Container Registry

### Mise à jour des secrets

```bash
# PostgreSQL
kubectl create secret generic postgres-secret \
  -n image-service-prod \
  --from-literal=POSTGRES_DB=image_service \
  --from-literal=POSTGRES_USER=user \
  --from-literal=POSTGRES_PASSWORD=<nouveau-mot-de-passe> \
  --dry-run=client -o yaml | kubectl apply -f -

# MinIO
kubectl create secret generic minio-secret \
  -n image-service-prod \
  --from-literal=MINIO_ROOT_USER=minioadmin \
  --from-literal=MINIO_ROOT_PASSWORD=<nouveau-mot-de-passe> \
  --dry-run=client -o yaml | kubectl apply -f -

# Puis redémarrer les déploiements
kubectl rollout restart deployment/postgres -n image-service-prod
kubectl rollout restart deployment/minio -n image-service-prod
kubectl rollout restart deployment/image-service -n image-service-prod
```

## 📝 Notes

- Les données PostgreSQL et MinIO sont persistées dans des PersistentVolumes
- Le service est accessible uniquement en HTTPS (redirection automatique)
- Le certificat SSL est automatiquement renouvelé par cert-manager
- Les health checks ne sont pas configurés (actuator non disponible dans l'application)

