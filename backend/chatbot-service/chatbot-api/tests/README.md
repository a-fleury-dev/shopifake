# Chatbot-API Tests

Comprehensive test suite for the chatbot-api service.

## Test Structure

```
tests/
├── __init__.py
├── conftest.py              # Test configuration and fixtures
├── test_health.py           # Health check endpoint tests
├── test_products.py         # Product indexing tests
├── test_search.py           # Vector search tests
├── test_chat.py             # Direct chat endpoint tests
├── test_intent.py           # Intent detection tests
├── test_assist.py           # Main assist endpoint tests
├── test_integration.py      # End-to-end integration tests
└── README.md               # This file
```

## Test Coverage

### Unit Tests

1. **Health Check (`test_health.py`)**
   - Basic health check
   - Response structure validation

2. **Product Indexing (`test_products.py`)**
   - Successful indexing
   - Empty product lists
   - Invalid data structures
   - Large batch indexing
   - Optional field handling

3. **Search (`test_search.py`)**
   - Basic search queries
   - Custom top_k values
   - Empty results
   - Special characters
   - Long queries
   - Score ordering

4. **Chat (`test_chat.py`)**
   - Basic chat interactions
   - Product questions
   - Empty responses
   - Long prompts
   - Special characters
   - Model and prompt validation

5. **Intent Detection (`test_intent.py`)**
   - Product search intent
   - FAQ intent
   - Other/general intent
   - Fallback regex parsing
   - Case sensitivity
   - Malformed responses

6. **Assist Endpoint (`test_assist.py`)**
   - Product search with results
   - FAQ queries (no search)
   - Other intent handling
   - Search failure recovery
   - Heuristic overrides
   - Context injection
   - Response structure

### Integration Tests

1. **Complete Workflows (`test_integration.py`)**
   - Full product discovery workflow
   - Customer service workflow
   - Mixed query workflow

2. **Edge Cases**
   - Large product batches
   - Unicode and special characters
   - Concurrent requests
   - Empty database searches

3. **Error Handling**
   - Database connection failures
   - Service unavailability
   - Malformed data
   - Invalid parameters

## Running Tests

### Prerequisites

Install test dependencies:

```bash
pip install pytest pytest-cov httpx
```

### Run All Tests

```bash
# From chatbot-api directory
pytest tests/

# With verbose output
pytest tests/ -v

# With coverage report
pytest tests/ --cov=app --cov-report=html
```

### Run Specific Test Files

```bash
pytest tests/test_assist.py -v
pytest tests/test_integration.py -v
```

### Run Specific Test Cases

```bash
pytest tests/test_assist.py::test_assist_product_search_with_results -v
pytest tests/test_integration.py::TestCompleteWorkflows::test_full_product_discovery_workflow -v
```

## Test Scenarios Covered

### Product Search Scenarios
- ✅ Finding cotton t-shirts
- ✅ Searching for running shoes
- ✅ Looking for winter clothing
- ✅ Organic/eco-friendly products
- ✅ No results found
- ✅ Partial matches

### Customer Service Scenarios
- ✅ Return policy questions
- ✅ Shipping information
- ✅ International shipping
- ✅ Size availability
- ✅ General FAQs

### Mixed Intent Scenarios
- ✅ Greeting + product search
- ✅ FAQ + product search
- ✅ Product search + follow-up questions
- ✅ Intent switching

### Error Scenarios
- ✅ Database connection failures
- ✅ LLM service unavailable
- ✅ Malformed data handling
- ✅ Empty/invalid queries
- ✅ Timeout handling

## Mocking Strategy

The tests use mocks for external services:

1. **LLM API (OpenAI)** - Mocked via `mock_ollama_chat` fixture which patches the internal `app.llm.chat_complete` helper
2. **Qdrant Vector DB** - Mocked with `mock_vectorstore` fixture
3. **Embeddings** - Mocked with `mock_embeddings` fixture

This allows tests to run without:
- Running Ollama service
- Running Qdrant database
- Making actual network calls

## Expected Test Results

All tests should pass when run with proper mocking. The test suite validates:

- ✅ API endpoint availability
- ✅ Request/response structure
- ✅ Intent detection logic
- ✅ Search result formatting
- ✅ Context injection for LLM
- ✅ Error handling
- ✅ Edge case handling

## Continuous Integration

These tests are designed to be run in CI/CD pipelines without external service dependencies.

## Future Test Additions

Consider adding:
- [ ] Performance/load tests
- [ ] Actual integration tests with running services
- [ ] Security tests (injection, sanitization)
- [ ] Rate limiting tests
- [ ] Streaming response tests (if implemented)
- [ ] Multi-language query tests
