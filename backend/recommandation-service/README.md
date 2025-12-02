# Recommendation Service

Service de recommandation de produits basé sur la similarité vectorielle. Ce service utilise la base vectorielle Qdrant pour proposer des produits similaires aux utilisateurs.

## 🚀 Fonctionnalités

- **Recommandations par produit**: Trouvez des produits similaires à un produit donné
- **Recommandations par texte**: Recherchez des produits basés sur une description textuelle
- **API RESTful**: Endpoints simples et documentés
- **Haute disponibilité**: Déployé avec 2 replicas pour la résilience
- **Intégration Qdrant**: Réutilise la base vectorielle du chatbot-service

## 📋 API Endpoints

### Health Check
```bash
GET /health
GET /
```

### Recommandations

#### 1. POST - Recommandations génériques
```bash
POST /api/v1/recommendations
Content-Type: application/json

# Par ID de produit
{
  "product_id": "product_123",
  "limit": 5
}

# Par requête texte
{
  "query": "red running shoes",
  "limit": 5
}
```

#### 2. GET - Recommandations par produit
```bash
GET /api/v1/recommendations/product/{product_id}?limit=5
```

#### 3. GET - Recommandations par recherche
```bash
GET /api/v1/recommendations/search?q=red+shoes&limit=5
```

#### 4. GET - Détails d'un produit
```bash
GET /api/v1/products/{product_id}
```

### Webhook (pour synchronisation avec le service produit)

#### POST - Webhook pour événements produits
```bash
POST /api/v1/webhook/products
Content-Type: application/json
X-Webhook-Secret: your-secret-key

# Création de produit
{
  "event_type": "product.created",
  "product": {
    "id": "product_123",
    "title": "Product Name",
    "description": "Description",
    "tags": ["tag1"],
    "price": 99.99,
    "category": "Category"
  }
}

# Mise à jour de produit
{
  "event_type": "product.updated",
  "product": { ... }
}

# Suppression de produit
{
  "event_type": "product.deleted",
  "product_id": "product_123"
}
```

## 🛠️ Installation locale

### Prérequis
- Python 3.11+
- Qdrant en cours d'exécution
- Clé API OpenAI

### Configuration

1. Créer un fichier `.env`:
```bash
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=products
OPENAI_EMBED_MODEL=text-embedding-3-small
MAX_RECOMMENDATIONS=10
DEFAULT_RECOMMENDATIONS=5
```

2. Installer les dépendances:
```bash
pip install -r requirements.txt
```

3. Lancer le service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

4. Accéder à la documentation:
- API Docs: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

## 🐳 Docker

### Build l'image
```bash
docker build -t recommandation-service .
```

### Lancer avec Docker Compose (avec Qdrant)
```bash
# Utiliser le docker-compose du chatbot-service qui inclut Qdrant
cd ../chatbot-service
docker-compose up -d qdrant

# Puis lancer le service de recommandation
cd ../recommandation-service
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=your_key \
  -e QDRANT_URL=http://qdrant:6333 \
  recommandation-service
```

## ☸️ Déploiement Kubernetes

### Automatique via GitHub Actions

Le déploiement est automatique:
- **Branch `staging`** → namespace `recommandation-staging`
- **Branch `main`** → namespace `recommandation-prod`

### Manuel

```bash
# Créer les namespaces
kubectl apply -f ../../k8s/recommandation-service/namespace.yaml

# Créer le secret OpenAI
kubectl create secret generic openai-secret \
  --from-literal=api-key=YOUR_OPENAI_API_KEY \
  --namespace=recommandation-staging

# Déployer
kubectl apply -f ../../k8s/recommandation-service/configmap.yaml -n recommandation-staging
kubectl apply -f ../../k8s/recommandation-service/recommandation-service-deployment.yaml -n recommandation-staging

# Vérifier le déploiement
kubectl get pods -n recommandation-staging
kubectl get svc -n recommandation-staging
```

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│          Recommendation Service             │
│  ┌──────────────────────────────────────┐   │
│  │  FastAPI Application                 │   │
│  │  - Health endpoints                  │   │
│  │  - Recommendation endpoints          │   │
│  └──────────────────────────────────────┘   │
│                    │                         │
│                    ▼                         │
│  ┌──────────────────────────────────────┐   │
│  │  Vector Store Module                 │   │
│  │  - Query Qdrant                      │   │
│  │  - Find similar products             │   │
│  └──────────────────────────────────────┘   │
│                    │                         │
└────────────────────┼─────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Qdrant Vector DB      │
        │  (chatbot-staging ns)  │
        │  - Product embeddings  │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  OpenAI API            │
        │  - Generate embeddings │
        └────────────────────────┘
```

## 🔧 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `OPENAI_API_KEY` | Clé API OpenAI (requis) | - |
| `QDRANT_URL` | URL du service Qdrant | `http://localhost:6333` |
| `QDRANT_COLLECTION` | Nom de la collection | `products` |
| `OPENAI_EMBED_MODEL` | Modèle d'embedding OpenAI | `text-embedding-3-small` |
| `MAX_RECOMMENDATIONS` | Nombre max de recommandations | `10` |
| `DEFAULT_RECOMMENDATIONS` | Nombre par défaut | `5` |

## 🧪 Tests

### Test du health endpoint
```bash
curl http://localhost:8080/health
```

### Test des recommandations par produit
```bash
curl http://localhost:8080/api/v1/recommendations/product/product_123?limit=5
```

### Test des recommandations par texte
```bash
curl "http://localhost:8080/api/v1/recommendations/search?q=red+shoes&limit=5"
```

## 📝 Notes

- Le service partage la même base vectorielle Qdrant que le chatbot-service
- Les embeddings sont générés par OpenAI (text-embedding-3-small)
- Le service utilise la distance cosinus pour calculer la similarité
- Les recommandations excluent automatiquement le produit source

## 🔗 Liens utiles

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation Qdrant](https://qdrant.tech/documentation/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
