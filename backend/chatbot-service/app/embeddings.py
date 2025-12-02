from typing import List
from fastapi import HTTPException

try:
    from openai import OpenAI  # type: ignore
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore

from .config import OPENAI_API_KEY, OPENAI_EMBED_MODEL


def _get_client():
    if OpenAI is None:
        raise HTTPException(
            status_code=500,
            detail="OpenAI SDK not installed. Ensure 'openai' is installed.",
        )
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not set.",
        )
    return OpenAI(api_key=OPENAI_API_KEY)


def embed(text: str) -> List[float]:
    try:
        client = _get_client()
        resp = client.embeddings.create(
            model=OPENAI_EMBED_MODEL,
            input=text,
        )
        data = resp.data[0].embedding if getattr(resp, "data", None) else None
        if not data:
            raise KeyError("embedding not in response")
        return list(data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Embedding service error: {e}")
