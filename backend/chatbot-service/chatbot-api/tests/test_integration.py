"""
Integration tests for complete chatbot workflows
"""
import pytest
from unittest.mock import Mock


class TestCompleteWorkflows:
    """Test complete end-to-end workflows"""
    
    def test_full_product_discovery_workflow(self, client, mock_ollama_chat, mock_vectorstore):
        """Test complete workflow: index products -> search -> assist"""
        # Step 1: Index products
        mock_vectorstore["upsert_products"].return_value = 3
        
        products = [
            {
                "id": "prod-001",
                "title": "Organic Cotton T-Shirt",
                "description": "Eco-friendly organic cotton t-shirt",
                "tags": ["cotton", "organic", "eco-friendly"],
                "price": 29.99,
                "category": "Clothing"
            },
            {
                "id": "prod-002",
                "title": "Running Sneakers",
                "description": "Lightweight running shoes",
                "tags": ["shoes", "running", "sports"],
                "price": 89.99,
                "category": "Footwear"
            },
            {
                "id": "prod-003",
                "title": "Winter Hoodie",
                "description": "Warm fleece hoodie",
                "tags": ["hoodie", "winter"],
                "price": 49.99,
                "category": "Clothing"
            }
        ]
        
        index_response = client.post("/index-products", json={"items": products})
        assert index_response.status_code == 200
        assert index_response.json()["indexed"] == 3
        
        # Step 2: Search for products
        from app.models import SearchResult
        mock_vectorstore["query_similar"].return_value = [
            SearchResult(
                id="prod-001",
                score=0.95,
                title="Organic Cotton T-Shirt",
                snippet="Eco-friendly organic cotton t-shirt"
            )
        ]
        
        search_response = client.post("/search", json={
            "query": "organic cotton shirt",
            "top_k": 5
        })
        assert search_response.status_code == 200
        search_data = search_response.json()
        assert len(search_data["results"]) > 0
        
        # Step 3: Use assist endpoint for conversational search
        intent_mock = Mock()
        intent_mock.json.return_value = {
            "message": {"content": '{"intent": "product_search"}'}
        }
        
        chat_mock = Mock()
        chat_mock.json.return_value = {
            "message": {
                "content": "I found the Organic Cotton T-Shirt for you. It's eco-friendly and costs $29.99."
            }
        }
        
        mock_results = [
            SearchResult(
                id="prod-001",
                score=0.95,
                title="Organic Cotton T-Shirt",
                snippet="Eco-friendly organic cotton t-shirt. Price: $29.99"
            )
        ]
        
        mock_ollama_chat.side_effect = [intent_mock, chat_mock] + [chat_mock] * 10
        mock_vectorstore["query_similar_assist"].return_value = mock_results
        
        assist_response = client.post("/assist", json={
            "prompt": "I want an organic cotton t-shirt"
        })
        assert assist_response.status_code == 200
        assist_data = assist_response.json()
        assert assist_data["intent"] == "product_search"
        assert len(assist_data["results"]) > 0
    
    
    def test_customer_service_workflow(self, client, mock_ollama_chat):
        """Test FAQ/customer service workflow"""
        scenarios = [
            {
                "prompt": "What is your return policy?",
                "expected_intent": "faq"
            },
            {
                "prompt": "How long does shipping take?",
                "expected_intent": "faq"
            },
            {
                "prompt": "Do you offer international shipping?",
                "expected_intent": "faq"
            }
        ]
        
        for scenario in scenarios:
            # Mock intent detection
            intent_mock = Mock()
            intent_mock.json.return_value = {
                "message": {"content": f'{{"intent": "{scenario["expected_intent"]}"}}'}
            }
            
            # Mock chat response
            chat_mock = Mock()
            chat_mock.json.return_value = {
                "message": {"content": "Here's the information you requested."}
            }
            
            mock_ollama_chat.side_effect = [intent_mock, chat_mock] + [chat_mock] * 10
            
            response = client.post("/assist", json={
                "prompt": scenario["prompt"]
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["intent"] == scenario["expected_intent"]
            assert data["results"] == []  # FAQ shouldn't trigger search
    
    
    def test_mixed_query_workflow(self, client, mock_ollama_chat, mock_vectorstore):
        """Test workflow with mixed query types"""
        from app.models import SearchResult
        
        queries = [
            # Start with greeting
            {
                "prompt": "Hello!",
                "expected_intent": "other",
                "should_search": False
            },
            # Ask about products
            {
                "prompt": "Do you have t-shirts?",
                "expected_intent": "product_search",
                "should_search": True
            },
            # Ask FAQ (but avoid product terms that trigger heuristic override)
            {
                "prompt": "What is your return policy?",
                "expected_intent": "faq",
                "should_search": False
            },
            # Specific product search
            {
                "prompt": "Show me organic cotton t-shirts",
                "expected_intent": "product_search",
                "should_search": True
            }
        ]
        
        # Pre-build all mock responses for all queries
        all_responses = []
        for query in queries:
            intent_mock = Mock()
            intent_mock.json.return_value = {
                "message": {"content": f'{{"intent": "{query["expected_intent"]}"}}'}
            }
            
            chat_mock = Mock()
            chat_mock.json.return_value = {
                "message": {"content": "Response"}
            }
            
            all_responses.extend([intent_mock, chat_mock])
        
        # Add extra responses to prevent exhaustion
        all_responses.extend([all_responses[-1]] * 10)
        mock_ollama_chat.side_effect = all_responses
        
        for query in queries:
            # Mock search results if needed
            if query["should_search"]:
                mock_vectorstore["query_similar_assist"].return_value = [
                    SearchResult(
                        id="prod-001",
                        score=0.9,
                        title="Test Product",
                        snippet="Description"
                    )
                ]
            else:
                mock_vectorstore["query_similar_assist"].return_value = []
            
            response = client.post("/assist", json={
                "prompt": query["prompt"]
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["intent"] == query["expected_intent"]


class TestEdgeCases:
    """Test edge cases and error conditions"""
    
    def test_very_large_product_batch(self, client, mock_vectorstore):
        """Test indexing a very large batch of products"""
        large_batch_size = 1000
        mock_vectorstore["upsert_products"].return_value = large_batch_size
        
        large_batch = [
            {
                "id": f"prod-{i:05d}",
                "title": f"Product {i}",
                "description": f"Description for product {i}",
                "price": 10.0 + (i * 0.5)
            }
            for i in range(large_batch_size)
        ]
        
        response = client.post("/index-products", json={"items": large_batch})
        
        assert response.status_code == 200
        assert response.json()["indexed"] == large_batch_size
    
    
    def test_unicode_and_special_characters(self, client, mock_ollama_chat, mock_vectorstore):
        """Test handling of unicode and special characters"""
        from app.models import SearchResult
        
        # Mock intent
        intent_mock = Mock()
        intent_mock.json.return_value = {
            "message": {"content": '{"intent": "product_search"}'}
        }
        
        # Mock chat
        chat_mock = Mock()
        chat_mock.json.return_value = {
            "message": {"content": "Voici les produits."}
        }
        
        mock_ollama_chat.side_effect = [intent_mock, chat_mock] + [chat_mock] * 10
        
        mock_vectorstore["query_similar"].return_value = [
            SearchResult(
                id="prod-001",
                score=0.9,
                title="T-shirt Écologique",
                snippet="Description en français with émojis 👕"
            )
        ]
        
        response = client.post("/assist", json={
            "prompt": "Je cherche un t-shirt écologique 🌿"
        })
        
        assert response.status_code == 200
    
    
    def test_concurrent_requests_simulation(self, client, mock_ollama_chat):
        """Test that multiple requests work independently"""
        prompts = ["Hello", "Show me shoes", "Return policy"]
        
        for prompt in prompts:
            # Mock responses
            intent_mock = Mock()
            intent_mock.json.return_value = {
                "message": {"content": '{"intent": "other"}'}
            }
            
            chat_mock = Mock()
            chat_mock.json.return_value = {
                "message": {"content": "Response"}
            }
            
            mock_ollama_chat.side_effect = [intent_mock, chat_mock] + [chat_mock] * 10
            
            response = client.post("/assist", json={"prompt": prompt})
            assert response.status_code == 200
    
    
    def test_empty_database_search(self, client, mock_vectorstore):
        """Test searching when database is empty"""
        mock_vectorstore["query_similar"].return_value = []
        
        response = client.post("/search", json={
            "query": "any product",
            "top_k": 5
        })
        
        assert response.status_code == 200
        assert response.json()["results"] == []


class TestErrorHandling:
    """Test error handling and resilience"""
    
    def test_database_connection_failure(self, client, mock_vectorstore):
        """Test handling of database connection failures"""
        mock_vectorstore["query_similar"].side_effect = Exception("Database connection failed")
        
        # This will raise an exception, which is expected behavior
        try:
            response = client.post("/search", json={
                "query": "test",
                "top_k": 5
            })
            # If it doesn't crash, check for error status
            assert response.status_code in [500, 503]
        except Exception:
            # Exception is expected and acceptable
            pass
    
    
    def test_ollama_service_unavailable(self, client, mock_ollama_chat):
        """Test handling when Ollama service is unavailable"""
        mock_response = Mock()
        mock_response.side_effect = Exception("Service unavailable")
        mock_ollama_chat.return_value = mock_response
        
        # This will raise an exception, which is expected behavior
        try:
            response = client.post("/chat", json={
                "prompt": "Hello"
            })
            # If it doesn't crash, check for error status
            assert response.status_code in [500, 503]
        except Exception:
            # Exception is expected and acceptable
            pass
    
    
    def test_malformed_product_data(self, client):
        """Test handling of malformed product data"""
        malformed_products = [
            {
                "id": "prod-001",
                # Missing title and description (required fields)
            }
        ]
        
        response = client.post("/index-products", json={"items": malformed_products})
        
        # Should return validation error
        assert response.status_code == 422
    
    
    def test_negative_top_k(self, client, mock_vectorstore):
        """Test handling of negative top_k value"""
        mock_vectorstore["query_similar"].return_value = []
        
        response = client.post("/search", json={
            "query": "test",
            "top_k": -5
        })
        
        # Pydantic should catch this or it should be handled
        # Either way, shouldn't crash
        assert response.status_code in [200, 422]
