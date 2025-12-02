"""
Tests for health check endpoint
"""


def test_health_check(client):
    """Test that health endpoint returns healthy status"""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "recommendation-service"


def test_health_check_explicit_endpoint(client):
    """Test explicit /health endpoint"""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "recommendation-service"


def test_health_check_response_structure(client):
    """Test health endpoint response structure"""
    response = client.get("/")
    data = response.json()

    # Verify response contains expected keys
    assert "status" in data
    assert "service" in data

    # Verify types
    assert isinstance(data["status"], str)
    assert isinstance(data["service"], str)


def test_health_check_consistency(client):
    """Test that multiple health checks return consistent results"""
    response1 = client.get("/")
    response2 = client.get("/health")

    assert response1.status_code == 200
    assert response2.status_code == 200

    # Both endpoints should return the same data
    assert response1.json() == response2.json()
