"""
Tests for product indexing endpoint
"""


def test_index_products_success(client, mock_vectorstore, sample_products):
    """Test successful product indexing"""
    mock_vectorstore["upsert_products"].return_value = len(sample_products)

    response = client.post("/index-products", json={"items": sample_products})

    assert response.status_code == 200
    data = response.json()
    assert data["indexed"] == 3
    mock_vectorstore["upsert_products"].assert_called_once()


def test_index_products_empty_list(client, mock_vectorstore):
    """Test indexing with empty product list"""
    response = client.post("/index-products", json={"items": []})

    assert response.status_code == 400
    data = response.json()
    assert "No products provided" in data["detail"]


def test_index_products_missing_items_field(client):
    """Test indexing without items field"""
    response = client.post("/index-products", json={})

    assert response.status_code == 422  # Validation error


def test_index_products_invalid_structure(client):
    """Test indexing with invalid product structure"""
    invalid_products = [
        {"id": "prod-001"}  # Missing required fields
    ]

    response = client.post("/index-products", json={"items": invalid_products})

    assert response.status_code == 422  # Pydantic validation error


def test_index_products_with_optional_fields(client, mock_vectorstore):
    """Test indexing products with optional fields"""
    mock_vectorstore["upsert_products"].return_value = 1

    products = [
        {
            "id": "prod-001",
            "title": "Test Product",
            "description": "Test description",
            # tags, price, category are optional
        }
    ]

    response = client.post("/index-products", json={"items": products})

    assert response.status_code == 200
    data = response.json()
    assert data["indexed"] == 1


def test_index_large_batch_of_products(client, mock_vectorstore):
    """Test indexing a large batch of products"""
    mock_vectorstore["upsert_products"].return_value = 100

    large_batch = [
        {
            "id": f"prod-{i:03d}",
            "title": f"Product {i}",
            "description": f"Description for product {i}",
            "price": 10.0 + i,
        }
        for i in range(100)
    ]

    response = client.post("/index-products", json={"items": large_batch})

    assert response.status_code == 200
    data = response.json()
    assert data["indexed"] == 100
