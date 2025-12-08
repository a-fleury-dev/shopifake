# Keycloak Kubernetes Deployment

Ce répertoire contient les manifests Kubernetes pour déployer Keycloak avec PostgreSQL sur le cluster.

## Architecture

- **Keycloak**: Service d'authentification et d'autorisation (2 réplicas pour HA)
- **PostgreSQL**: Base de données pour Keycloak (1 réplica avec PVC)
- **Ingress**: Exposition via Traefik avec certificat SSL Let's Encrypt

## Prérequis

1. Cluster Kubernetes avec Traefik installé
2. cert-manager installé et configuré avec Let's Encrypt
3. Accès au GitHub Container Registry (ghcr.io)
4. Secret `ghcr-secret` créé dans le namespace

## Déploiement

### Déploiement automatique

```bash
./deploy.sh [tag]
```

Le script va :
1. Builder l'image Docker pour linux/amd64
2. La pusher vers GitHub Container Registry
3. Créer le namespace `keycloak-prod`
4. Déployer PostgreSQL et attendre qu'il soit prêt
5. Déployer Keycloak
6. Configurer l'Ingress avec SSL

### Déploiement manuel

```bash
# 1. Créer le namespace
kubectl apply -f namespace.yaml

# 2. Copier le secret ghcr-secret (si nécessaire)
kubectl get secret ghcr-secret -n frontend-prod -o yaml | \
  sed 's/namespace: frontend-prod/namespace: keycloak-prod/' | \
  kubectl apply -f -

# 3. Déployer PostgreSQL
kubectl apply -f postgres-keycloak-deployment.yaml

# 4. Attendre que PostgreSQL soit prêt
kubectl wait --for=condition=ready pod -l app=postgres-keycloak -n keycloak-prod --timeout=300s

# 5. Déployer Keycloak
kubectl apply -f configmap.yaml
kubectl apply -f keycloak-deployment.yaml

# 6. Configurer l'Ingress
kubectl apply -f keycloak-ingress.yaml
```

## Configuration

### Secrets à changer en production

Les secrets par défaut sont dans les fichiers YAML et **doivent être changés en production** :

```bash
# Changer le mot de passe admin de Keycloak
kubectl create secret generic keycloak-secret \
  --from-literal=KEYCLOAK_ADMIN_PASSWORD='votre_mot_de_passe_fort' \
  --from-literal=KC_DB_PASSWORD='mot_de_passe_postgres_fort' \
  -n keycloak-prod \
  --dry-run=client -o yaml | kubectl apply -f -

# Changer les credentials PostgreSQL
kubectl create secret generic postgres-keycloak-secret \
  --from-literal=POSTGRES_DB='keycloak' \
  --from-literal=POSTGRES_USER='keycloak_user' \
  --from-literal=POSTGRES_PASSWORD='mot_de_passe_postgres_fort' \
  -n keycloak-prod \
  --dry-run=client -o yaml | kubectl apply -f -

# Redémarrer les pods pour appliquer les nouveaux secrets
kubectl rollout restart deployment/postgres-keycloak -n keycloak-prod
kubectl rollout restart deployment/keycloak -n keycloak-prod
```

### Variables d'environnement importantes

Dans `configmap.yaml` :
- `KEYCLOAK_MODE`: "prod" (utilise `kc.sh start` au lieu de `start-dev`)
- `KC_HOSTNAME`: "keycloak.shopifake.duckdns.org"
- `KC_PROXY`: "edge" (pour fonctionner derrière Traefik)
- `KC_HTTP_ENABLED`: "true" (Traefik gère le SSL)

## Accès

- **URL**: https://keycloak.shopifake.duckdns.org
- **Admin Console**: https://keycloak.shopifake.duckdns.org/admin
- **Health Check**: https://keycloak.shopifake.duckdns.org/health
- **Metrics**: https://keycloak.shopifake.duckdns.org/metrics

### Identifiants par défaut

- **Username**: admin
- **Password**: Voir le secret `keycloak-secret` (clé `KEYCLOAK_ADMIN_PASSWORD`)

## Vérification

```bash
# Voir les pods
kubectl get pods -n keycloak-prod

# Voir les logs Keycloak
kubectl logs -n keycloak-prod -l app=keycloak -f

# Voir les logs PostgreSQL
kubectl logs -n keycloak-prod -l app=postgres-keycloak -f

# Vérifier le service
kubectl get svc -n keycloak-prod

# Vérifier l'Ingress
kubectl get ingress -n keycloak-prod

# Vérifier le certificat SSL
kubectl get certificate -n keycloak-prod

# Vérifier le PVC PostgreSQL
kubectl get pvc -n keycloak-prod
```

## Realm Import

Le realm `shopifake` est automatiquement importé au démarrage via le fichier `/opt/keycloak/import/realm-export.json` intégré dans l'image Docker.

Pour modifier le realm :
1. Modifier `backend/keycloak/keycloak-data/import/realm-export.json`
2. Rebuilder et redéployer l'image

## Troubleshooting

### Keycloak ne démarre pas

```bash
# Vérifier les logs
kubectl logs -n keycloak-prod -l app=keycloak

# Vérifier que PostgreSQL est accessible
kubectl exec -it -n keycloak-prod deployment/keycloak -- sh
# Dans le pod:
nc -zv postgres-keycloak 5432
```

### PostgreSQL ne démarre pas

```bash
# Vérifier les logs
kubectl logs -n keycloak-prod -l app=postgres-keycloak

# Vérifier le PVC
kubectl get pvc -n keycloak-prod
kubectl describe pvc postgres-keycloak-pvc -n keycloak-prod
```

### Certificat SSL non créé

```bash
# Vérifier cert-manager
kubectl get certificate -n keycloak-prod
kubectl describe certificate keycloak-tls -n keycloak-prod

# Vérifier les logs cert-manager
kubectl logs -n cert-manager -l app=cert-manager
```

## Mise à jour

```bash
# Avec un nouveau tag
./deploy.sh v1.2.3

# Ou forcer la mise à jour avec latest
kubectl rollout restart deployment/keycloak -n keycloak-prod
```

## Sauvegarde et restauration

### Sauvegarde PostgreSQL

```bash
# Dump de la base de données
kubectl exec -n keycloak-prod deployment/postgres-keycloak -- \
  pg_dump -U keycloak_user keycloak > keycloak-backup.sql
```

### Restauration PostgreSQL

```bash
# Restaurer depuis un dump
kubectl exec -i -n keycloak-prod deployment/postgres-keycloak -- \
  psql -U keycloak_user keycloak < keycloak-backup.sql
```

## Scaling

```bash
# Scaler Keycloak (horizontal)
kubectl scale deployment/keycloak --replicas=3 -n keycloak-prod

# Note: PostgreSQL reste en 1 réplica (nécessite une solution HA pour scaler)
```

## Sécurité

⚠️ **Important** :
1. Changez tous les mots de passe par défaut en production
2. Activez les backups réguliers de PostgreSQL
3. Configurez les limites de ressources appropriées
4. Surveillez les logs et métriques
5. Mettez à jour régulièrement Keycloak pour les patches de sécurité

