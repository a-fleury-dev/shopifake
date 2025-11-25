"""
Tests for search endpoint
"""
import pytest
from app.models import SearchResult


def test_search_basic_query(client, mock_vectorstore):
    """Test basic search functionality"""
    mock_results = [
        SearchResult(
            id="prod-001",
            score=0.92,
            title="Organic Cotton T-Shirt",
            snippet="Comfortable organic cotton t-shirt"
        ),
        SearchResult(
            id="prod-002",
            score=0.85,
            title="Cotton Shirt",
            snippet="Classic cotton shirt"
        )
    ]
    mock_vectorstore["query_similar"].return_value = mock_results
    
    response = client.post("/search", json={
        "query": "cotton t-shirt",
        "top_k": 5
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) == 2
    assert data["results"][0]["id"] == "prod-001"
    assert data["results"][0]["score"] == 0.92


def test_search_with_custom_top_k(client, mock_vectorstore):
    """Test search with custom top_k parameter"""
    mock_vectorstore["query_similar"].return_value = []
    
    response = client.post("/search", json={
        "query": "sneakers",
        "top_k": 10
    })
    
    assert response.status_code == 200
    mock_vectorstore["query_similar"].assert_called_once_with("sneakers", 10)


def test_search_default_top_k(client, mock_vectorstore):
    """Test search with default top_k value"""
    mock_vectorstore["query_similar"].return_value = []
    
    response = client.post("/search", json={
        "query": "shoes"
    })
    
    assert response.status_code == 200
    # Default top_k should be 5
    mock_vectorstore["query_similar"].assert_called_once_with("shoes", 5)


def test_search_no_results(client, mock_vectorstore):
    """Test search when no results are found"""
    mock_vectorstore["query_similar"].return_value = []
    
    response = client.post("/search", json={
        "query": "nonexistent product xyz"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["results"] == []


def test_search_missing_query(client):
    """Test search without query parameter"""
    response = client.post("/search", json={"top_k": 5})
    
    assert response.status_code == 422  # Validation error


def test_search_empty_query(client, mock_vectorstore):
    """Test search with empty query string"""
    mock_vectorstore["query_similar"].return_value = []
    
    response = client.post("/search", json={
        "query": "",
        "top_k": 5
    })
    
    assert response.status_code == 200


def test_search_special_characters(client, mock_vectorstore):
    """Test search with special characters in query"""
    mock_vectorstore["query_similar"].return_value = []
    
    response = client.post("/search", json={
        "query": "t-shirt & hoodie (100% cotton)",
        "top_k": 5
    })
    
    assert response.status_code == 200


def test_search_long_query(client, mock_vectorstore):
    """Test search with very long query string"""
    mock_vectorstore["query_similar"].return_value = []
    
    long_query = "I'm looking for " + "comfortable " * 50 + "cotton t-shirt"
    response = client.post("/search", json={
        "query": long_query,
        "top_k": 5
    })
    
    assert response.status_code == 200


def test_search_with_high_scores(client, mock_vectorstore):
    """Test that search results maintain score ordering"""
    mock_results = [
        SearchResult(id="prod-001", score=0.99, title="Product 1", snippet="Best match"),
        SearchResult(id="prod-002", score=0.95, title="Product 2", snippet="Second best"),
        SearchResult(id="prod-003", score=0.90, title="Product 3", snippet="Third best"),
    ]
    mock_vectorstore["query_similar"].return_value = mock_results
    
    response = client.post("/search", json={
        "query": "test query",
        "top_k": 5
    })
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify scores are in descending order
    scores = [result["score"] for result in data["results"]]
    assert scores == sorted(scores, reverse=True)
