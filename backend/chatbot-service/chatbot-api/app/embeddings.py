from typing import List
import requests
from fastapi import HTTPException
from .config import OLLAMA_HOST, EMBED_MODEL


def embed(text: str) -> List[float]:
    try:
        r = requests.post(
            f"{OLLAMA_HOST}/api/embeddings",
            json={"model": EMBED_MODEL, "prompt": text},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        if "embedding" not in data:
            raise KeyError("embedding not in response")
        return data["embedding"]
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Embedding service error: {e}")
