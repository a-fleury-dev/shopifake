from openai import OpenAI
from typing import List

from .config import OPENAI_API_KEY, OPENAI_EMBED_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)


def embed(text: str) -> List[float]:
    """
    Generate embedding vector for given text using OpenAI API.
    
    Args:
        text: Input text to embed
        
    Returns:
        List of floats representing the embedding vector
    """
    if not text or not text.strip():
        text = "empty"
    
    response = client.embeddings.create(
        model=OPENAI_EMBED_MODEL,
        input=text.strip()
    )
    
    return response.data[0].embedding
