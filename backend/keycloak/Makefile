# ============================
# Companion Project Makefile
# ============================

# 🧩 Configuration
SERVICE       := keycloak
COMPOSE_FILE  := docker-compose.yml
PROFILE       := dev

# ============================
# 🚀 Run Commands
# ============================

# Start containers (cached build)
up:
	docker compose -f $(COMPOSE_FILE) up -d $(SERVICE)

# Rebuild + start (always updates image)
rebuild:
	docker compose -f $(COMPOSE_FILE) up --build -d $(SERVICE)

# Rebuild from scratch (no cache)
rebuild-clean:
	docker compose -f $(COMPOSE_FILE) build --no-cache $(SERVICE)
	docker compose -f $(COMPOSE_FILE) up -d $(SERVICE)

# View logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f $(SERVICE)

# Stop containers (keep volumes & images)
stop:
	docker compose -f $(COMPOSE_FILE) stop

# ============================
# 🧹 Clean Commands
# ============================

# Stop and remove containers
down:
	docker compose -f $(COMPOSE_FILE) down

# Stop + remove containers, volumes, and images
clean:
	docker compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

# ============================
# 🧪 Utility Commands
# ============================

# Show running containers
ps:
	docker compose -f $(COMPOSE_FILE) ps
# ============================
# 🧩 Default Target
# ============================
.DEFAULT_GOAL := rebuild