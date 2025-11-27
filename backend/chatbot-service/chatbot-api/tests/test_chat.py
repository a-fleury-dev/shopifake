"""
Tests for chat endpoint
"""

from unittest.mock import Mock


def test_chat_basic_query(client, mock_ollama_chat):
    """Test basic chat functionality"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {"content": "Hello! How can I help you today?"}
    }
    mock_ollama_chat.return_value = mock_response

    response = client.post("/chat", json={"prompt": "Hello"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["response"] == "Hello! How can I help you today?"


def test_chat_product_question(client, mock_ollama_chat):
    """Test chat with product-related question"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": "I can help you find t-shirts. What style are you looking for?"
        }
    }
    mock_ollama_chat.return_value = mock_response

    response = client.post("/chat", json={"prompt": "Do you have t-shirts?"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_chat_empty_response_from_ollama(client, mock_ollama_chat):
    """Test chat when Ollama returns empty response"""
    mock_response = Mock()
    mock_response.json.return_value = {"message": {"content": ""}}
    mock_ollama_chat.return_value = mock_response

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
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {"content": "I understand your detailed question."}
    }
    mock_ollama_chat.return_value = mock_response

    long_prompt = "Tell me about " + "organic cotton t-shirts " * 50
    response = client.post("/chat", json={"prompt": long_prompt})

    assert response.status_code == 200


def test_chat_with_special_characters(client, mock_ollama_chat):
    """Test chat with special characters in prompt"""
    mock_response = Mock()
    mock_response.json.return_value = {"message": {"content": "I can help with that."}}
    mock_ollama_chat.return_value = mock_response

    response = client.post(
        "/chat", json={"prompt": "Do you have 100% cotton & organic t-shirts?"}
    )

    assert response.status_code == 200


def test_chat_malformed_ollama_response(client, mock_ollama_chat):
    """Test chat handling of malformed Ollama response"""
    mock_response = Mock()
    mock_response.json.return_value = {}  # Missing message key
    mock_ollama_chat.return_value = mock_response

    response = client.post("/chat", json={"prompt": "Hello"})

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == ""  # Should handle gracefully


def test_chat_uses_correct_model_and_system_prompt(client, mock_ollama_chat):
    """Test that chat uses correct model and system prompt"""
    mock_response = Mock()
    mock_response.json.return_value = {"message": {"content": "Response"}}
    mock_ollama_chat.return_value = mock_response

    response = client.post("/chat", json={"prompt": "Test"})

    assert response.status_code == 200

    # Verify the Ollama API was called with correct parameters
    call_args = mock_ollama_chat.call_args
    json_data = call_args[1]["json"]

    assert json_data["model"] == "deepseek-r1:1.5b"
    assert json_data["stream"] is False
    assert len(json_data["messages"]) == 2
    assert json_data["messages"][0]["role"] == "system"
    assert json_data["messages"][1]["role"] == "user"
    assert json_data["messages"][1]["content"] == "Test"
