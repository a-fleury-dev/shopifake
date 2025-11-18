# Chatbot Service

Service de chatbot avec RAG (Retrieval-Augmented Generation) basé sur Mistral AI pour recommander des produits Shopifake.

## Architecture

- **Mistral AI** : LLM pour générer les réponses et créer les embeddings
- **Qdrant** : Base de données vectorielle pour stocker les produits
- **Express** : API REST

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` avec :
```
MISTRAL_API_KEY=votre_clé_api_mistral
PORT=3000
QDRANT_HOST=localhost
QDRANT_PORT=6333
PRODUCT_SERVICE_URL=http://localhost:8080/api/products
```

## Démarrage

### Option 1 : Développement local du chatbot seul

```bash
# 1. Démarrer uniquement Qdrant et le chatbot
docker-compose -f docker-compose.dev.yml up -d

# 2. Ou démarrer manuellement
# Démarrer Qdrant
docker run -d -p 6333:6333 -p 6334:6334 --name qdrant qdrant/qdrant

# Démarrer le service en mode dev
npm run dev
```

### Option 2 : Avec tous les services Shopifake (Recommandé)

```bash
# À la racine du projet
cd ../..
docker-compose up -d
```

### 3. Indexer les produits
```bash
# Avec des produits mock (pour tester)
Invoke-RestMethod -Uri http://localhost:3000/products/index -Method POST

# Avec vos propres produits
Invoke-RestMethod -Uri http://localhost:3000/products/index -Method POST -ContentType "application/json" -Body '{"products": [...]}'
```

## Endpoints

### POST /products/index
Indexer les produits dans la base vectorielle.

**Body (optionnel):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "Smartphone Apple...",
      "price": 1229,
      "category": "Smartphones",
      "stock": 15
    }
  ]
}
```

Si aucun body n'est fourni, le service tentera de récupérer les produits depuis `PRODUCT_SERVICE_URL` ou utilisera des produits mock.

### GET /products/status
Vérifier le nombre de produits indexés.

**Response:**
```json
{
  "indexed": 8,
  "ready": true
}
```

### POST /chat
Discuter avec le chatbot et obtenir des recommandations de produits.

**Body:**
```json
{
  "message": "Je cherche un smartphone haut de gamme",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "Je vous recommande l'iPhone 15 Pro à 1229€...",
  "products": [...],
  "conversationHistory": [...]
}
```

### POST /chat/reset
Réinitialiser l'historique de conversation.

### GET /health
Vérifier l'état du service.

## Exemples d'utilisation

```powershell
# Vérifier le status
Invoke-RestMethod http://localhost:3000/health

# Indexer les produits
Invoke-RestMethod -Uri http://localhost:3000/products/index -Method POST

# Vérifier l'indexation
Invoke-RestMethod http://localhost:3000/products/status

# Rechercher un produit
Invoke-RestMethod -Uri http://localhost:3000/chat -Method POST -ContentType "application/json" -Body '{"message": "Je cherche un ordinateur portable pour le développement"}'
```

## Comment ça marche (RAG)

1. **Indexation** : Les produits sont transformés en vecteurs via Mistral Embed et stockés dans Qdrant
2. **Recherche** : La question de l'utilisateur est transformée en vecteur
3. **Récupération** : Les produits les plus similaires sont récupérés de Qdrant (recherche vectorielle)
4. **Génération** : Mistral génère une réponse en utilisant les produits trouvés comme contexte

