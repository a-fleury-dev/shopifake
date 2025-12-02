"""
Tests for configuration settings
"""

import os
from unittest.mock import patch


def test_default_qdrant_url():
    """Test default Qdrant URL"""
    from app.config import QDRANT_URL

    # If no env var is set, should use default
    assert QDRANT_URL is not None
    assert isinstance(QDRANT_URL, str)


def test_default_qdrant_collection():
    """Test default Qdrant collection name"""
    from app.config import QDRANT_COLLECTION

    assert QDRANT_COLLECTION is not None
    assert isinstance(QDRANT_COLLECTION, str)
    assert QDRANT_COLLECTION == "products"


def test_openai_api_key():
    """Test OpenAI API key configuration"""
    from app.config import OPENAI_API_KEY

    assert isinstance(OPENAI_API_KEY, str)


def test_openai_embed_model():
    """Test OpenAI embedding model configuration"""
    from app.config import OPENAI_EMBED_MODEL

    assert OPENAI_EMBED_MODEL is not None
    assert isinstance(OPENAI_EMBED_MODEL, str)
    assert OPENAI_EMBED_MODEL == "text-embedding-3-small"


def test_max_recommendations():
    """Test max recommendations configuration"""
    from app.config import MAX_RECOMMENDATIONS

    assert MAX_RECOMMENDATIONS is not None
    assert isinstance(MAX_RECOMMENDATIONS, int)
    assert MAX_RECOMMENDATIONS > 0


def test_default_recommendations():
    """Test default recommendations configuration"""
    from app.config import DEFAULT_RECOMMENDATIONS, MAX_RECOMMENDATIONS

    assert DEFAULT_RECOMMENDATIONS is not None
    assert isinstance(DEFAULT_RECOMMENDATIONS, int)
    assert DEFAULT_RECOMMENDATIONS > 0
    assert DEFAULT_RECOMMENDATIONS <= MAX_RECOMMENDATIONS


def test_webhook_secret():
    """Test webhook secret configuration"""
    from app.config import WEBHOOK_SECRET

    assert isinstance(WEBHOOK_SECRET, str)


def test_custom_qdrant_url():
    """Test custom Qdrant URL from environment"""
    custom_url = "http://custom-qdrant:6333"
    with patch.dict(os.environ, {"QDRANT_URL": custom_url}):
        # Need to reload config module to pick up new env var
        import importlib
        import app.config

        importlib.reload(app.config)

        assert app.config.QDRANT_URL == custom_url


def test_custom_max_recommendations():
    """Test custom max recommendations from environment"""
    with patch.dict(os.environ, {"MAX_RECOMMENDATIONS": "20"}):
        import importlib
        import app.config

        importlib.reload(app.config)

        assert app.config.MAX_RECOMMENDATIONS == 20
