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

dev-main-chatbot: ## Démarrer l'environnement pour main-api + chatbot (PostgreSQL, Qdrant)
	@echo "🚀 Démarrage de l'environnement main-api + chatbot..."
	docker-compose up -d postgres-main postgres-image minio qdrant
	@echo "⏳ Attente du démarrage des services..."
	@sleep 10
	@echo "✅ Environnement prêt!"
	@echo "📊 PostgreSQL Main API : localhost:5432"
	@echo "📊 PostgreSQL Image Service : localhost:5555"
	@echo "🗂️  MinIO Console : http://localhost:9001 (minioadmin/minioadmin)"
	@echo "🗂️  MinIO API : http://localhost:9000"
	@echo "🔍 Qdrant API : http://localhost:6333"
	@echo "🔍 Qdrant UI : http://localhost:6334/dashboard"
	@echo ""
	@echo "Pour lancer les services applicatifs:"
	@echo "  - Main API: cd main-api && mvn spring-boot:run"
	@echo "  - Chatbot: make chatbot-up"

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

# Python Services
chatbot-setup: ## Créer l'environnement virtuel et installer les dépendances du chatbot
	@echo "🔧 Configuration de l'environnement chatbot..."
	@cd chatbot-service && python3 -m venv venv
	@cd chatbot-service && . venv/bin/activate && pip install -r requirements.txt
	@echo "✅ Environnement chatbot prêt!"

chatbot-up: ## Démarrer le service chatbot (FastAPI)
	@echo "🤖 Démarrage du chatbot service..."
	@cd chatbot-service && . venv/bin/activate && uvicorn main:app --reload --port 8000

recommandation-setup: ## Créer l'environnement virtuel et installer les dépendances de recommandation
	@echo "🔧 Configuration de l'environnement recommandation..."
	@cd recommandation-service && python3 -m venv venv
	@cd recommandation-service && . venv/bin/activate && pip install -r requirements.txt
	@echo "✅ Environnement recommandation prêt!"

recommandation-up: ## Démarrer le service de recommandation (FastAPI)
	@echo "🎯 Démarrage du recommandation service..."
	@cd recommandation-service && . venv/bin/activate && uvicorn app.main:app --reload --port 8001

