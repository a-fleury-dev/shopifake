"""
Test configuration and fixtures for recommendation-service tests
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from main import app


@pytest.fixture
def client():
    """FastAPI test client"""
    return TestClient(app)


@pytest.fixture
def mock_vectorstore():
    """Mock vector store operations"""
    with (
        patch("app.routes.recommendations.recommend_by_product") as mock_rec_product,
        patch("app.routes.recommendations.recommend_by_text") as mock_rec_text,
        patch("app.routes.recommendations.get_product_by_id") as mock_get_product,
        patch("app.routes.recommendations.upsert_products") as mock_upsert,
        patch("app.routes.webhook.upsert_products") as mock_upsert_webhook,
        patch("app.vectorstore.ensure_collection") as mock_ensure,
    ):
        yield {
            "recommend_by_product": mock_rec_product,
            "recommend_by_text": mock_rec_text,
            "get_product_by_id": mock_get_product,
            "upsert_products": mock_upsert,
            "upsert_products_webhook": mock_upsert_webhook,
            "ensure_collection": mock_ensure,
        }


@pytest.fixture(autouse=True)
def mock_embeddings():
    """Mock embedding generation - auto-applied to all tests"""
    with patch("app.embeddings.generate_embedding") as mock_embed:
        # Return a fixed dimension embedding vector (1536 for text-embedding-3-small)
        mock_embed.return_value = [0.1] * 1536
        yield mock_embed


@pytest.fixture(autouse=True)
def mock_qdrant():
    """Mock Qdrant client - auto-applied to all tests"""
    with patch("app.vectorstore.qdrant") as mock_client:
        # Mock get_collections to return empty list or specific collection
        mock_collections = Mock()
        mock_collections.collections = []
        mock_client.get_collections.return_value = mock_collections
        mock_client.recreate_collection.return_value = None
        mock_client.upsert.return_value = None

        # Mock search/query_points methods
        mock_client.search.return_value = []
        mock_client.query_points.return_value = Mock(points=[])

        yield mock_client


@pytest.fixture
def sample_products():
    """Sample product data for testing"""
    return [
        {
            "id": "prod-001",
            "title": "Organic Cotton T-Shirt",
            "description": "Comfortable organic cotton t-shirt in various colors",
            "tags": ["cotton", "organic", "t-shirt"],
            "price": 29.99,
            "category": "Clothing",
        },
        {
            "id": "prod-002",
            "title": "Running Sneakers",
            "description": "Lightweight running shoes with cushioned sole",
            "tags": ["shoes", "running", "sports"],
            "price": 89.99,
            "category": "Footwear",
        },
        {
            "id": "prod-003",
            "title": "Winter Hoodie",
            "description": "Warm fleece hoodie perfect for cold weather",
            "tags": ["hoodie", "winter", "fleece"],
            "price": 49.99,
            "category": "Clothing",
        },
    ]


@pytest.fixture
def sample_recommendations():
    """Sample recommendation results"""
    from app.models import Product

    return [
        Product(
            id="prod-001",
            title="Organic Cotton T-Shirt",
            description="Comfortable organic cotton t-shirt in various colors",
            tags=["cotton", "organic", "t-shirt"],
            price=29.99,
            category="Clothing",
            score=0.92,
        ),
        Product(
            id="prod-003",
            title="Winter Hoodie",
            description="Warm fleece hoodie perfect for cold weather",
            tags=["hoodie", "winter", "fleece"],
            price=49.99,
            category="Clothing",
            score=0.78,
        ),
    ]
