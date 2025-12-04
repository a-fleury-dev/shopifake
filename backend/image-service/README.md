# Image Service

Service de gestion des images pour Shopifake.

## Architecture

Ce service utilise :

- **Spring Boot 3.5.7** avec Java 21
- **PostgreSQL** pour la base de données
- **MinIO** pour le stockage d'objets
- **Flyway** pour les migrations de base de données
- **SpringDoc** pour la documentation API

## Prérequis

- Docker et Docker Compose
- Make (optionnel mais recommandé)

## Configuration

### Ports

- **8083** : Application Spring Boot
- **5555** : PostgreSQL
- **9000** : MinIO API
- **9001** : Console MinIO

### Base de données

- **Nom** : `image_service`
- **Utilisateur** : `user`
- **Mot de passe** : `pwd`

### MinIO

- **Bucket** : `marche-conclu-images-dev`
- **Access Key** : `minioadmin`
- **Secret Key** : `minioadmin`

## Démarrage rapide

### Avec Make

```bash
# Afficher toutes les commandes disponibles
make help

# Démarrer tous les services
make up

# Voir les logs
make logs

# Arrêter les services
make down
```

### Sans Make

```bash
# Démarrer tous les services
docker-compose -f docker-compose-dev.yml up -d

# Voir les logs
docker-compose -f docker-compose-dev.yml logs -f

# Arrêter les services
docker-compose -f docker-compose-dev.yml down
```

## Commandes Make disponibles


| Commande              | Description                             |
| --------------------- | --------------------------------------- |
| `make help`           | Afficher l'aide                         |
| `make build`          | Construire les images Docker            |
| `make up`             | Démarrer tous les services             |
| `make down`           | Arrêter et supprimer les conteneurs    |
| `make restart`        | Redémarrer les services                |
| `make logs`           | Afficher les logs                       |
| `make logs-app`       | Logs de l'application uniquement        |
| `make logs-postgres`  | Logs PostgreSQL uniquement              |
| `make logs-minio`     | Logs MinIO uniquement                   |
| `make ps`             | Lister les conteneurs                   |
| `make clean`          | Nettoyer complètement                  |
| `make rebuild`        | Reconstruire tout                       |
| `make dev`            | Démarrer seulement PostgreSQL et MinIO |
| `make shell-app`      | Ouvrir un shell dans l'application      |
| `make shell-postgres` | Ouvrir psql                             |
| `make minio-console`  | Afficher l'URL de la console MinIO      |
| `make swagger`        | Afficher l'URL de Swagger               |

## Développement

### Développement local (sans Docker)

Pour développer localement sans Docker pour l'application :

```bash
# Démarrer uniquement PostgreSQL et MinIO
make dev

# Puis lancer l'application depuis votre IDE
```

### Accès aux interfaces

- **Swagger UI** : http://localhost:8083/swagger-ui.html
- **API Docs** : http://localhost:8083/api-docs
- **Console MinIO** : http://localhost:9001 (minioadmin/minioadmin)

### Connexion à la base de données

```bash
# Via Make
make shell-postgres

# Ou directement
docker-compose exec postgres psql -U user -d image_service
```

## Migrations Flyway

Les migrations sont situées dans :

- `src/main/resources/db/migration/` - Migrations de production
- `src/main/resources/db/dev-local/` - Données de développement

Flyway s'exécute automatiquement au démarrage de l'application.

## Troubleshooting

### Les services ne démarrent pas

```bash
# Vérifier les logs
make logs

# Vérifier l'état
make ps
```

### Réinitialiser complètement

```bash
# Tout supprimer et reconstruire
make clean
make build
make up
```

### Problèmes de connexion MinIO

Vérifiez que le bucket a été créé :

```bash
docker-compose logs minio-init
```

