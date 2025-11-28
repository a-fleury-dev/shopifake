"""
Tests for chat endpoint
"""


def test_chat_basic_query(client, mock_ollama_chat):
    """Test basic chat functionality"""
    mock_ollama_chat.return_value = "Hello! How can I help you today?"

    response = client.post("/chat", json={"prompt": "Hello"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["response"] == "Hello! How can I help you today?"


def test_chat_product_question(client, mock_ollama_chat):
    """Test chat with product-related question"""
    mock_ollama_chat.return_value = (
        "I can help you find t-shirts. What style are you looking for?"
    )

    response = client.post("/chat", json={"prompt": "Do you have t-shirts?"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_chat_empty_response_from_ollama(client, mock_ollama_chat):
    """Test chat when Ollama returns empty response"""
    mock_ollama_chat.return_value = ""

    response = client.post("/chat", json={"prompt": "Test prompt"})

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == ""


def test_chat_missing_prompt(client):
    """Test chat without prompt parameter"""
    response = client.post("/chat", json={})

    assert response.status_code == 422  # Validation error


def test_chat_with_long_prompt(client, mock_ollama_chat):
    """Test chat with very long prompt"""
    mock_ollama_chat.return_value = "I understand your detailed question."

    long_prompt = "Tell me about " + "organic cotton t-shirts " * 50
    response = client.post("/chat", json={"prompt": long_prompt})

    assert response.status_code == 200


def test_chat_with_special_characters(client, mock_ollama_chat):
    """Test chat with special characters in prompt"""
    mock_ollama_chat.return_value = "I can help with that."

    response = client.post(
        "/chat", json={"prompt": "Do you have 100% cotton & organic t-shirts?"}
    )

    assert response.status_code == 200


def test_chat_malformed_ollama_response(client, mock_ollama_chat):
    """Test chat handling of malformed Ollama response"""
    # If underlying returns None or malformed, our wrapper returns empty string
    mock_ollama_chat.return_value = ""

    response = client.post("/chat", json={"prompt": "Hello"})

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == ""  # Should handle gracefully


def test_chat_uses_correct_model_and_system_prompt(client, mock_ollama_chat):
    """Test that chat uses correct model and system prompt"""
    mock_ollama_chat.return_value = "Response"

    response = client.post("/chat", json={"prompt": "Test"})

    assert response.status_code == 200

    # Verify our abstraction was called with correct parameters
    _, kwargs = mock_ollama_chat.call_args
    assert kwargs["json_mode"] is False
    assert kwargs["temperature"] == 0.7
    assert isinstance(kwargs["system_prompt"], str) and len(kwargs["system_prompt"]) > 0
    assert kwargs["user_prompt"] == "Test"
