"""
Test configuration and fixtures for chatbot-api tests
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
    # Patch where the functions are USED, not where they're defined
    with (
        patch("app.routes.search.query_similar") as mock_query_search,
        patch("app.routes.products.upsert_products") as mock_upsert_products,
        patch("app.routes.assist.query_similar") as mock_query_assist,
        patch("app.vectorstore.ensure_collection") as mock_ensure,
    ):
        yield {
            "query_similar": mock_query_search,  # For search endpoint
            "query_similar_assist": mock_query_assist,  # For assist endpoint
            "upsert_products": mock_upsert_products,
            "ensure_collection": mock_ensure,
        }


@pytest.fixture(autouse=True)
def mock_embeddings():
    """Mock embedding generation - auto-applied to all tests"""
    with patch("app.embeddings.embed") as mock_embed:
        # Return a fixed dimension embedding vector
        mock_embed.return_value = [0.1] * 768
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
def sample_search_results():
    """Sample search results from vector store"""
    return [
        {
            "id": "prod-001",
            "score": 0.92,
            "title": "Organic Cotton T-Shirt",
            "snippet": "Comfortable organic cotton t-shirt in various colors",
        },
        {
            "id": "prod-003",
            "score": 0.78,
            "title": "Winter Hoodie",
            "snippet": "Warm fleece hoodie perfect for cold weather",
        },
    ]
