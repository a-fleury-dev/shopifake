"""
Tests for assist endpoint - the main chatbot interface
"""

from app.models import SearchResult


def test_assist_product_search_with_results(client, mock_ollama_chat, mock_vectorstore):
    """Test assist endpoint with product search intent and results"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "product_search"}'
    chat_response = "I found these cotton t-shirts for you: Organic Cotton T-Shirt and Classic Cotton Tee."

    # Use side_effect with extra repeats to prevent StopIteration
    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    # Mock vector search results
    mock_results = [
        SearchResult(
            id="prod-001",
            score=0.92,
            title="Organic Cotton T-Shirt",
            snippet="Comfortable organic cotton t-shirt in various colors",
        ),
        SearchResult(
            id="prod-002",
            score=0.85,
            title="Classic Cotton Tee",
            snippet="Classic fit cotton t-shirt",
        ),
    ]
    mock_vectorstore["query_similar_assist"].return_value = mock_results

    response = client.post(
        "/assist", json={"prompt": "Show me cotton t-shirts", "top_k": 5}
    )

    assert response.status_code == 200
    data = response.json()

    assert "response" in data
    assert "results" in data
    assert "intent" in data
    assert data["intent"] == "product_search"
    assert len(data["results"]) == 2
    assert data["results"][0]["id"] == "prod-001"


def test_assist_faq_no_search(client, mock_ollama_chat, mock_vectorstore):
    """Test assist endpoint with FAQ intent - should not perform search"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "faq"}'
    chat_response = "Our return policy allows returns within 30 days of purchase."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    response = client.post("/assist", json={"prompt": "What is your return policy?"})

    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "faq"
    assert data["results"] == []  # No search results for FAQ
    assert "return policy" in data["response"].lower()

    # Verify search was NOT called
    mock_vectorstore["query_similar"].assert_not_called()


def test_assist_other_intent(client, mock_ollama_chat):
    """Test assist endpoint with 'other' intent"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "other"}'
    chat_response = "Hello! How can I help you today?"

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    response = client.post("/assist", json={"prompt": "Hello"})

    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "other"
    assert data["results"] == []


def test_assist_product_search_no_results(client, mock_ollama_chat, mock_vectorstore):
    """Test assist with product search but no matching products"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "product_search"}'
    chat_response = "I'm sorry, I couldn't find any products matching your search."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10
    mock_vectorstore["query_similar_assist"].return_value = []

    response = client.post("/assist", json={"prompt": "Find purple unicorn shoes"})

    assert response.status_code == 200
    data = response.json()

    assert data["intent"] == "product_search"
    assert data["results"] == []


def test_assist_search_failure_graceful_degradation(
    client, mock_ollama_chat, mock_vectorstore
):
    """Test assist handles search failures gracefully"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "product_search"}'
    chat_response = "I'm having trouble accessing the product database right now."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10
    mock_vectorstore["query_similar"].side_effect = Exception(
        "Vector DB connection failed"
    )

    response = client.post("/assist", json={"prompt": "Show me shoes"})

    assert response.status_code == 200
    data = response.json()

    # Should still return a response, just without search results
    assert data["intent"] == "product_search"
    assert data["results"] == []
    assert "response" in data


def test_assist_custom_top_k(client, mock_ollama_chat, mock_vectorstore):
    """Test assist with custom top_k parameter"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "product_search"}'
    chat_response = "Here are the products."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10
    mock_vectorstore["query_similar_assist"].return_value = []

    response = client.post("/assist", json={"prompt": "Show me products", "top_k": 10})

    assert response.status_code == 200
    mock_vectorstore["query_similar_assist"].assert_called_once_with(
        "Show me products", 10
    )


def test_assist_default_top_k(client, mock_ollama_chat):
    """Test assist uses default top_k of 5"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "faq"}'
    chat_response = "Response"

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    response = client.post("/assist", json={"prompt": "Test"})

    assert response.status_code == 200


def test_assist_context_injection_for_products(
    client, mock_ollama_chat, mock_vectorstore
):
    """Test that product context is injected into system prompt"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "product_search"}'
    chat_response = "Check out these products."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    mock_results = [
        SearchResult(
            id="prod-001", score=0.95, title="Test Product", snippet="Test description"
        )
    ]
    mock_vectorstore["query_similar_assist"].return_value = mock_results

    response = client.post("/assist", json={"prompt": "Show me products"})

    assert response.status_code == 200

    # Verify the second call (final chat) includes context in system message
    final_call = mock_ollama_chat.call_args_list[1]
    system_content = final_call[1]["system_prompt"]

    assert "Context:" in system_content
    assert "Test Product" in system_content


def test_assist_missing_prompt(client):
    """Test assist without prompt parameter"""
    response = client.post("/assist", json={})

    assert response.status_code == 422  # Validation error


def test_assist_long_prompt(client, mock_ollama_chat):
    """Test assist with very long prompt"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "other"}'
    chat_response = "I understand."

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    long_prompt = "I'm looking for " + "a very comfortable " * 100 + "t-shirt"

    response = client.post("/assist", json={"prompt": long_prompt})

    assert response.status_code == 200


def test_assist_response_structure(client, mock_ollama_chat):
    """Test that assist response has correct structure"""
    # Mock intent detection and final chat response
    intent_response = '{"intent": "other"}'
    chat_response = "Response"

    mock_ollama_chat.side_effect = [intent_response, chat_response] + [
        chat_response
    ] * 10

    response = client.post("/assist", json={"prompt": "Test"})

    assert response.status_code == 200
    data = response.json()

    # Verify all required fields
    assert "response" in data
    assert "results" in data
    assert "intent" in data

    assert isinstance(data["response"], str)
    assert isinstance(data["results"], list)
    assert isinstance(data["intent"], str)
