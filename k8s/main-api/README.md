# Déploiement de main-api sur Kubernetes

## 📋 Prérequis

- Cluster Kubernetes avec Traefik et cert-manager installés
- Secret `ghcr-secret` pour accéder au GitHub Container Registry
- (Optionnel) Base de données PostgreSQL accessible depuis le cluster

## 🚀 Déploiement Rapide

### 1. Créer les namespaces
```bash
kubectl apply -f namespace.yaml
```

### 2. Créer le secret pour la base de données (si nécessaire)
```bash
kubectl create secret generic main-api-secrets \
  --namespace=main-api-prod \
  --from-literal=db-password=YOUR_DB_PASSWORD
```

### 3. Déployer le ConfigMap
```bash
kubectl apply -f configmap.yaml
```

### 4. Déployer l'application
```bash
kubectl apply -f main-api-deployment.yaml
```

### 5. Déployer l'Ingress avec HTTPS
```bash
kubectl apply -f main-api-ingress.yaml
```

## 🔍 Vérification

### Vérifier les pods
```bash
kubectl get pods -n main-api-prod
```

### Vérifier le service
```bash
kubectl get svc -n main-api-prod
```

### Vérifier l'Ingress
```bash
kubectl get ingress -n main-api-prod
```

### Vérifier le certificat TLS
```bash
kubectl get certificate -n main-api-prod
kubectl describe certificate main-api-tls -n main-api-prod
```

### Voir les logs
```bash
kubectl logs -n main-api-prod -l app=main-api --tail=100 -f
```

## 🌐 Accès

L'API sera accessible à l'adresse : `https://shopifake.duckdns.org/api`

Le routing est basé sur le path `/api` qui redirige vers le service main-api. Le middleware Traefik `strip-api-prefix` retire le préfixe `/api` avant de transférer la requête au service.

### Endpoints disponibles
- Health check: `https://shopifake.duckdns.org/api/actuator/health`
- API Documentation (si Swagger activé): `https://shopifake.duckdns.org/api/swagger-ui.html`

## 🔧 Configuration

### Variables d'environnement (ConfigMap)

Les variables sont configurées dans `configmap.yaml`. Pour modifier:
1. Éditer le fichier `configmap.yaml`
2. Appliquer les changements: `kubectl apply -f configmap.yaml`
3. Redémarrer les pods: `kubectl rollout restart deployment/main-api -n main-api-prod`

### Secrets

Les informations sensibles (comme les mots de passe) doivent être dans des Secrets:
```bash
kubectl create secret generic main-api-secrets \
  --namespace=main-api-prod \
  --from-literal=db-password=YOUR_PASSWORD \
  --dry-run=client -o yaml | kubectl apply -f -
```

## 📊 Scaling

### Augmenter le nombre de réplicas
```bash
kubectl scale deployment/main-api --replicas=3 -n main-api-prod
```

### Autoscaling (HPA)
```bash
kubectl autoscale deployment main-api \
  --namespace=main-api-prod \
  --cpu-percent=70 \
  --min=2 \
  --max=10
```

## 🔄 Mise à jour

### Rolling update
```bash
kubectl set image deployment/main-api \
  main-api=ghcr.io/a-fleury-dev/shopifake/main-api:NEW_TAG \
  -n main-api-prod
```

### Vérifier le statut du rollout
```bash
kubectl rollout status deployment/main-api -n main-api-prod
```

### Rollback si nécessaire
```bash
kubectl rollout undo deployment/main-api -n main-api-prod
```

## 🐛 Dépannage

### Pods qui ne démarrent pas
```bash
kubectl describe pod -n main-api-prod -l app=main-api
kubectl logs -n main-api-prod -l app=main-api --previous
```

### Problèmes de certificat
```bash
kubectl describe certificate main-api-tls -n main-api-prod
kubectl get challenges -n main-api-prod
kubectl describe order -n main-api-prod
```

### Problèmes d'Ingress
```bash
kubectl describe ingress main-api-ingress -n main-api-prod
kubectl logs -n kube-system -l app.kubernetes.io/name=traefik
```

## 📝 Notes

- Les probes (liveness, readiness, startup) utilisent les endpoints Actuator de Spring Boot
- Le certificat TLS est automatiquement géré par cert-manager avec Let's Encrypt
- La redirection HTTP → HTTPS est automatique via le Middleware Traefik
- Les ressources CPU/Memory sont configurées pour un environnement de production

