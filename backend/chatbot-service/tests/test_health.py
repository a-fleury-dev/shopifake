"""
Tests for health check endpoint
"""


def test_health_check(client):
    """Test that health endpoint returns ok status"""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "chatbot-service"


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
