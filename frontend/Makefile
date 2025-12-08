.PHONY: help build up down logs clean dev dev-down dev-logs restart

help: ## Afficher cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Production
build: ## Builder l'image Docker de production
	docker-compose build

up: ## Démarrer le frontend en mode production
	docker-compose up -d

down: ## Arrêter le frontend en mode production
	docker-compose down

logs: ## Voir les logs du frontend en mode production
	docker-compose logs -f frontend

restart: down up ## Redémarrer le frontend en mode production

# Développement
dev: ## Démarrer le frontend en mode développement avec hot-reload
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Arrêter le frontend en mode développement
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Voir les logs du frontend en mode développement
	docker-compose -f docker-compose.dev.yml logs -f frontend-dev

dev-restart: dev-down dev ## Redémarrer le frontend en mode développement

# Nettoyage
clean: ## Nettoyer les conteneurs, images et volumes
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

clean-all: clean ## Nettoyer complètement (incluant l'image)
	docker rmi shopifake-frontend 2>/dev/null || true

# Installation locale
install: ## Installer les dépendances localement
	npm install

dev-local: ## Lancer en mode développement local (sans Docker)
	npm run dev

build-local: ## Builder localement (sans Docker)
	npm run build

start-local: ## Démarrer le serveur de production localement
	npm run start
