# Keycloak Identity Management Service

## 🎯 Overview

**Keycloak** serves as the identity and access management solution for the Companion application, providing centralized authentication and authorization services for all microservices.

### Key Features
- **Keycloak 26.4.0** configured as SSO provider with OpenID Connect/OAuth 2.0
- Pre-configured **`companion` realm** with application-specific settings
- Automatic realm import on first startup
- Support for user management, roles, permissions, and federation
- Communication with Frontend and API Gateway
- Dual-mode operation (Development & Production)

## 📁 Project Structure

```
keycloak/
├── Dockerfile                  # Multi-mode container image
├── docker-compose.yml          # Local orchestration
├── init-db.sh                  # Database initialization script
├── Makefile                    # Development commands
├── README.md                   # Service documentation
├── .env.dev.example            # Development configuration template
├── .env.prod.example           # Production configuration template
├── .gitignore                  # Exclude sensitive & runtime data
└── keycloak-data/
    └── import/
        └── realm-export.json   # Companion realm configuration
```

## Development vs Production Mode

This setup uses a single Dockerfile that supports both development and production modes via the `KEYCLOAK_MODE` environment variable.

### Development Mode (default)
```bash
# Using docker-compose (default)
docker-compose up

# Or explicitly set the mode
KEYCLOAK_MODE=dev docker-compose up
```

### Production Mode
```bash
KEYCLOAK_MODE=prod docker-compose up
```

The `KEYCLOAK_MODE` variable accepts:
- `dev` (default): Runs `kc.sh start-dev` - optimized for development with auto-reload and relaxed security
- `prod`: Runs `kc.sh start` - optimized for production with build-time optimizations and strict security
### Why This Approach?

**✅ Recommended: Single Dockerfile + ENV variable**
- Single source of truth
- Easy to maintain
- Flexible deployment across environments
- Works with Docker Compose, Kubernetes, and other orchestrators

**❌ Not Recommended:**
- Two separate Dockerfiles: Code duplication and maintenance overhead
- Build-time ARG only: Less flexible at runtime

## Realm Configuration

The setup automatically imports the **`companion` realm** on first startup using the configuration file located at:
```
keycloak-data/import/realm-export.json
```

### What's Included
This pre-configured realm contains:
- Realm settings and security policies
- Client applications configured for the Companion ecosystem
- Roles and permissions structure
- User federation settings
- OpenID Connect/OAuth 2.0 configurations

### Import Configuration
The import is controlled by environment variables:
- `IMPORT_FILE_PATH`: Path to the realm file (default: `/opt/keycloak/data/import/realm-export.json`)
- `OVERWRITE_EXISTING_REALM`: Whether to overwrite existing realm data (default: `false`)

### Updating Realm Configuration
To export the current realm configuration:
1. Access the Admin Console
2. Select the `companion` realm
3. Go to **Realm Settings** → **Action** → **Partial Export**
4. Export to `keycloak-data/import/realm-export.json`

## Important Endpoints

Once Keycloak is running (default: `http://localhost:8080`):

### Admin Console
- **URL**: `http://localhost:8080/admin`
- Access with `KEYCLOAK_ADMIN` credentials

### Realm Endpoints (replace `{realm}` with `companion`)
- **OpenID Configuration**: `http://localhost:8080/realms/{realm}/.well-known/openid-configuration`
- **Token Endpoint**: `http://localhost:8080/realms/{realm}/protocol/openid-connect/token`
- **Authorization Endpoint**: `http://localhost:8080/realms/{realm}/protocol/openid-connect/auth`
- **User Info**: `http://localhost:8080/realms/{realm}/protocol/openid-connect/userinfo`
- **Logout**: `http://localhost:8080/realms/{realm}/protocol/openid-connect/logout`
- **Account Console**: `http://localhost:8080/realms/{realm}/account`

## Quick Start

1. Set up your environment variables (copy from `.env.example` if available)
2. Start the services:
   ```bash
   docker-compose up
   ```
3. Access the admin console at `http://localhost:8080/admin`
4. The `companion` realm is automatically loaded and ready to use

