.PHONY: help build up down start stop restart logs clean ps

# Variables
DOCKER_COMPOSE = docker-compose -f docker-compose-dev.yml
SERVICE_NAME = image-service

help: ## Afficher cette aide
	@echo "Commandes disponibles pour $(SERVICE_NAME):"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construire les images Docker
	$(DOCKER_COMPOSE) build

up: ## Démarrer tous les services (mode détaché)
	$(DOCKER_COMPOSE) up -d

down: ## Arrêter et supprimer tous les conteneurs
	$(DOCKER_COMPOSE) down

start: ## Démarrer les services existants
	$(DOCKER_COMPOSE) start

stop: ## Arrêter les services
	$(DOCKER_COMPOSE) stop

restart: ## Redémarrer les services
	$(DOCKER_COMPOSE) restart

logs: ## Afficher les logs (suivre en temps réel)
	$(DOCKER_COMPOSE) logs -f

logs-app: ## Afficher uniquement les logs de l'application
	$(DOCKER_COMPOSE) logs -f $(SERVICE_NAME)

logs-postgres: ## Afficher uniquement les logs de PostgreSQL
	$(DOCKER_COMPOSE) logs -f postgres

logs-minio: ## Afficher uniquement les logs de MinIO
	$(DOCKER_COMPOSE) logs -f minio

ps: ## Lister les conteneurs en cours d'exécution
	$(DOCKER_COMPOSE) ps

clean: ## Nettoyer complètement (conteneurs, volumes, images)
	$(DOCKER_COMPOSE) down -v --rmi all

clean-volumes: ## Supprimer uniquement les volumes
	$(DOCKER_COMPOSE) down -v

rebuild: ## Reconstruire et redémarrer tous les services
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d

# Code quality commands
checkstyle: ## Vérifier le style du code avec Checkstyle
	./mvnw checkstyle:check

checkstyle-report: ## Générer un rapport HTML Checkstyle
	./mvnw checkstyle:checkstyle
	@echo "Rapport disponible dans : target/site/checkstyle.html"

quality: ## Vérifier la qualité du code (Checkstyle)
	./mvnw checkstyle:check

validate: ## Valider le projet (inclut Checkstyle)
	./mvnw validate

test-build: ## Tester le build complet (inclut Checkstyle + Tests)
	./mvnw clean verify
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d

dev: ## Démarrer l'environnement de développement (PostgreSQL et MinIO seulement)
	$(DOCKER_COMPOSE) up -d postgres minio

shell-app: ## Ouvrir un shell dans le conteneur de l'application
	$(DOCKER_COMPOSE) exec $(SERVICE_NAME) /bin/sh

shell-postgres: ## Ouvrir un shell PostgreSQL
	$(DOCKER_COMPOSE) exec postgres psql -U user -d image_service

health: ## Vérifier l'état de santé des services
	@echo "État des services:"
	@$(DOCKER_COMPOSE) ps

minio-console: ## Afficher l'URL de la console MinIO
	@echo "Console MinIO disponible à: http://localhost:9001"
	@echo "Identifiants: minioadmin / minioadmin"

swagger: ## Afficher l'URL de Swagger UI
	@echo "Swagger UI disponible à: http://localhost:8083/swagger-ui.html"

