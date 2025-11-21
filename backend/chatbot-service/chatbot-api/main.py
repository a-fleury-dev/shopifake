from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from typing import List, Optional

# Qdrant client
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

app = FastAPI()
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://ollama:11434")
# Embeddings/Qdrant configuration (phase 2)
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "products")

# Init Qdrant client
qdrant = QdrantClient(url=QDRANT_URL)
SYSTEM_PROMPT = """
You are an e-commerce assistant specializing in helping customers find products.
Your role is to clarify customer needs, answer questions, and guide them to relevant products.

Guidelines:

* Maintain a professional, friendly, and reassuring tone.
* Never invent product details.
* If a customer is searching for something, rephrase their request into a clear intent.
* If product information is missing, ask for details such as size, color, budget, or intended use.
* Keep responses concise: 2 to 4 sentences maximum.
* Never mention anything about your internal workings.
* Always focus on being helpful and ensuring customer satisfaction.
"""



class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


# ---- Embedding + Search models ----
class Product(BaseModel):
    id: str  # original catalog id (string)
    title: str
    description: str
    tags: Optional[List[str]] = None
    price: Optional[float] = None
    category: Optional[str] = None


class IndexProductsRequest(BaseModel):
    items: List[Product]


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    id: str
    score: float
    title: Optional[str] = None
    snippet: Optional[str] = None


class SearchResponse(BaseModel):
    results: List[SearchResult]


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


def ensure_collection() -> None:
    # Create collection if missing, inferring vector size from a probe embedding
    collections = [c.name for c in qdrant.get_collections().collections]
    if QDRANT_COLLECTION in collections:
        return
    dim = len(embed("dimension probe"))
    qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
    )


def product_text(p: Product) -> str:
    parts = [p.title or "", p.description or ""]
    if p.category:
        parts.append(f"Category: {p.category}")
    if p.tags:
        parts.append("Tags: " + ", ".join(p.tags))
    return "\n".join([s for s in parts if s]).strip()


@app.get("/")
def health():
    return {"status": "ok", "service": "chatbot-api"}


@app.post("/index-products")
def index_products(req: IndexProductsRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="No products provided")
    ensure_collection()
    points: List[PointStruct] = []
    for idx, item in enumerate(req.items, start=1):
        vec = embed(product_text(item))
        points.append(
            PointStruct(
                id=idx,  # Qdrant requires int or UUID; store original id in payload
                vector=vec,
                payload={
                    "product_id": item.id,
                    "title": item.title,
                    "description": item.description,
                    "tags": item.tags,
                    "price": item.price,
                    "category": item.category,
                },
            )
        )
    qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points)
    return {"indexed": len(points)}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    ensure_collection()
    q_vec = embed(req.query)
    limit = max(1, min(req.top_k, 50))
    # Support both legacy `search` API and new `query_points` API depending on client version
    try:
        if hasattr(qdrant, "search"):
            raw = qdrant.search(
                collection_name=QDRANT_COLLECTION,
                query_vector=q_vec,
                limit=limit,
                with_payload=True,
            )
            points = raw
        else:
            raw = qdrant.query_points(
                collection_name=QDRANT_COLLECTION,
                query=q_vec,
                limit=limit,
                with_payload=True,
            )
            points = raw.points
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search failed: {e}")

    results: List[SearchResult] = []
    for r in points:
        payload = getattr(r, "payload", {}) or {}
        score = getattr(r, "score", None)
        desc = (payload.get("description") or "")[:220]
        results.append(
            SearchResult(
                id=payload.get("product_id", str(getattr(r, "id", "?"))),
                score=float(score) if score is not None else 0.0,
                title=payload.get("title"),
                snippet=desc,
            )
        )
    return SearchResponse(results=results)


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.prompt}
            ]
        }
    )

    data = resp.json()
    answer = data.get("message", {}).get("content", "")

    return ChatResponse(response=answer)

