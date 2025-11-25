"""
Tests for intent detection endpoint
"""
import pytest
from unittest.mock import Mock
import json


def test_intent_product_search(client, mock_ollama_chat):
    """Test intent detection for product search queries"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "product_search"}'
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Show me cotton t-shirts"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "product_search"


def test_intent_faq(client, mock_ollama_chat):
    """Test intent detection for FAQ queries"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "faq"}'
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "What is your return policy?"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "faq"


def test_intent_other(client, mock_ollama_chat):
    """Test intent detection for other/general queries"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "other"}'
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Hello, how are you?"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "other"


def test_intent_fallback_regex_parsing(client, mock_ollama_chat):
    """Test intent fallback to regex when JSON parsing fails"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": "The intent is product_search based on the query"
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Looking for shoes"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "product_search"


def test_intent_fallback_to_other(client, mock_ollama_chat):
    """Test intent defaults to 'other' when no match found"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": "This is some random text without intent keywords"
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Random question"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "other"


def test_intent_case_insensitive(client, mock_ollama_chat):
    """Test that intent detection is case-insensitive"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "PRODUCT_SEARCH"}'
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Show me products"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "product_search"  # Should be lowercased


def test_intent_malformed_json(client, mock_ollama_chat):
    """Test intent handling of malformed JSON"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "product_search"'  # Missing closing brace
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Find shoes"
    })
    
    assert response.status_code == 200
    data = response.json()
    # Should fall back to regex parsing
    assert data["intent"] in ["product_search", "faq", "other"]


def test_intent_empty_response(client, mock_ollama_chat):
    """Test intent with empty Ollama response"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": ""
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "Test query"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "other"  # Default fallback


def test_intent_uses_correct_parameters(client, mock_ollama_chat):
    """Test that intent detection uses correct API parameters"""
    mock_response = Mock()
    mock_response.json.return_value = {
        "message": {
            "content": '{"intent": "faq"}'
        }
    }
    mock_ollama_chat.return_value = mock_response
    
    response = client.post("/intent", json={
        "prompt": "What's your shipping policy?"
    })
    
    assert response.status_code == 200
    
    # Verify correct parameters
    call_args = mock_ollama_chat.call_args
    json_data = call_args[1]["json"]
    
    assert json_data["model"] == "deepseek-r1:1.5b"
    assert json_data["stream"] is False
    assert json_data["format"] == "json"
    assert json_data["options"]["temperature"] == 0
    
    # Verify timeout
    assert call_args[1]["timeout"] == 60


def test_intent_missing_prompt(client):
    """Test intent detection without prompt"""
    response = client.post("/intent", json={})
    
    assert response.status_code == 422  # Validation error
