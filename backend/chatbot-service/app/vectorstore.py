from typing import List
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from .config import QDRANT_URL, QDRANT_COLLECTION
from .embeddings import embed
from .models import Product, SearchResult


qdrant = QdrantClient(url=QDRANT_URL)


def ensure_collection() -> None:
    collections = [c.name for c in qdrant.get_collections().collections]
    if QDRANT_COLLECTION in collections:
        return
    dim = len(embed("dimension probe"))
    qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
    )


def product_text(p: Product) -> str:
    """
    Generate text for embedding from product data.
    Only includes semantically meaningful fields (name, description).
    Excludes: id, shop_id, category_id, slug, is_active, timestamps
    as they don't contribute to semantic similarity.
    """
    parts = [p.name or "", p.description or ""]
    return "\n".join([s for s in parts if s]).strip()


def upsert_products(items: List[Product]) -> int:
    ensure_collection()
    points: List[PointStruct] = []
    for item in items:
        vec = embed(product_text(item))
        points.append(
            PointStruct(
                id=item.id,  # Use actual product ID from database
                vector=vec,
                payload={
                    "product_id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "shop_id": item.shop_id,
                    "category_id": item.category_id,
                    "slug": item.slug,
                    "is_active": item.is_active,
                },
            )
        )
    qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points)
    return len(points)


def query_similar(query_text: str, top_k: int = 5) -> List[SearchResult]:
    ensure_collection()
    q_vec = embed(query_text)
    limit = max(1, min(top_k, 50))

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

    results: List[SearchResult] = []
    for r in points:
        payload = getattr(r, "payload", {}) or {}
        score = getattr(r, "score", None)
        desc = (payload.get("description") or "")[:220]
        results.append(
            SearchResult(
                id=payload.get("product_id", getattr(r, "id", 0)),
                score=float(score) if score is not None else 0.0,
                name=payload.get("name"),
                snippet=desc,
            )
        )

    return results
