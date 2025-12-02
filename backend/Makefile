.PHONY: help build up down restart logs clean rebuild dev-up dev-down dev-restart

help: ## Afficher cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Compiler les services
	docker-compose build

up: ## Démarrer tous les services
	docker-compose up -d

down: ## Arrêter tous les services
	docker-compose down

restart: ## Redémarrer tous les services
	docker-compose restart

logs: ## Afficher les logs de tous les services
	docker-compose logs -f

logs-main: ## Afficher les logs de main-api
	docker-compose logs -f main-api

logs-image: ## Afficher les logs de image-service
	docker-compose logs -f image-service

clean: ## Arrêter et supprimer les volumes
	docker-compose down -v

rebuild: ## Rebuild et redémarrer tous les services
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

dev-up: ## Démarrer l'environnement de développement
	@echo "🚀 Démarrage de l'environnement de développement..."
	docker-compose up -d postgres-main postgres-image minio
	@echo "⏳ Attente du démarrage des bases de données..."
	@sleep 10
	@echo "✅ Environnement de développement prêt!"
	@echo "📊 PostgreSQL Main API : localhost:5432"
	@echo "📊 PostgreSQL Image Service : localhost:5555"
	@echo "🗂️  MinIO Console : http://localhost:9001 (minioadmin/minioadmin)"
	@echo "🗂️  MinIO API : http://localhost:9000"

dev-down: ## Arrêter l'environnement de développement
	docker-compose down

dev-restart: ## Redémarrer l'environnement de développement
	docker-compose restart postgres-main postgres-image minio

dev: dev-up ## Alias pour dev-up

full-up: ## Démarrer tous les services (DB + applications)
	@echo "🚀 Démarrage de tous les services..."
	docker-compose up -d
	@echo "✅ Tous les services sont démarrés!"
	@echo "🌐 Main API : http://localhost:5001"
	@echo "🌐 Image Service : http://localhost:5002"
	@echo "📊 PostgreSQL Main API : localhost:5432"
	@echo "📊 PostgreSQL Image Service : localhost:5555"
	@echo "🗂️  MinIO Console : http://localhost:9001"

status: ## Afficher le status de tous les services
	docker-compose ps

ps: status ## Alias pour status

