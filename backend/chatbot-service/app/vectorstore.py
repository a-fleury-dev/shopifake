from typing import List
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

from .config import QDRANT_URL, QDRANT_COLLECTION
from .embeddings import embed
from .models import ProductVariant, SearchResult


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


def product_variant_text(variant: ProductVariant) -> str:
    """
    Generate text for embedding from product variant data.
    Combines product name, description, and variant attributes.
    Only includes semantically meaningful fields.
    Excludes: IDs, SKU, price, stock, slug, is_active, timestamps
    as they don't contribute to semantic similarity.
    """
    parts = [
        variant.product_name or "",
        variant.product_description or ""
    ]
    
    # Add variant attributes (e.g., "color: blue", "size: M")
    if variant.attributes:
        attrs_text = ", ".join([f"{k}: {v}" for k, v in variant.attributes.items()])
        parts.append(attrs_text)
    
    return "\n".join([s for s in parts if s]).strip()


def upsert_product_variants(items: List[ProductVariant]) -> int:
    ensure_collection()
    points: List[PointStruct] = []
    for item in items:
        vec = embed(product_variant_text(item))
        points.append(
            PointStruct(
                id=item.id,  # Use actual variant ID from database
                vector=vec,
                payload={
                    "variant_id": item.id,
                    "product_id": item.product_id,
                    "shop_id": item.shop_id,
                    "sku": item.sku,
                    "price": str(item.price),  # Convert Decimal to string for JSON
                    "stock": item.stock,
                    "is_active": item.is_active,
                    "product_name": item.product_name,
                    "product_slug": item.product_slug,
                    "product_description": item.product_description,
                    "category_id": item.category_id,
                    "attributes": item.attributes,
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
        desc = (payload.get("product_description") or "")[:220]
        
        # Convert price string back to Decimal
        from decimal import Decimal
        price_str = payload.get("price")
        price = Decimal(price_str) if price_str else None
        
        results.append(
            SearchResult(
                id=payload.get("variant_id", getattr(r, "id", 0)),
                score=float(score) if score is not None else 0.0,
                sku=payload.get("sku"),
                product_name=payload.get("product_name"),
                price=price,
                stock=payload.get("stock"),
                attributes=payload.get("attributes", {}),
                snippet=desc,
            )
        )

    return results


def query_similar_by_shop(query_text: str, shop_id: int, top_k: int = 5) -> List[SearchResult]:
    """
    Search for similar product variants filtered by shop_id.
    Only returns results from the specified shop.
    """
    ensure_collection()
    q_vec = embed(query_text)
    limit = max(1, min(top_k, 50))

    # Create filter for shop_id
    shop_filter = Filter(
        must=[
            FieldCondition(
                key="shop_id",
                match=MatchValue(value=shop_id)
            )
        ]
    )

    if hasattr(qdrant, "search"):
        raw = qdrant.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=q_vec,
            query_filter=shop_filter,
            limit=limit,
            with_payload=True,
        )
        points = raw
    else:
        raw = qdrant.query_points(
            collection_name=QDRANT_COLLECTION,
            query=q_vec,
            query_filter=shop_filter,
            limit=limit,
            with_payload=True,
        )
        points = raw.points

    results: List[SearchResult] = []
    for r in points:
        payload = getattr(r, "payload", {}) or {}
        score = getattr(r, "score", None)
        desc = (payload.get("product_description") or "")[:220]
        
        # Convert price string back to Decimal
        from decimal import Decimal
        price_str = payload.get("price")
        price = Decimal(price_str) if price_str else None
        
        results.append(
            SearchResult(
                id=payload.get("variant_id", getattr(r, "id", 0)),
                score=float(score) if score is not None else 0.0,
                sku=payload.get("sku"),
                product_name=payload.get("product_name"),
                price=price,
                stock=payload.get("stock"),
                attributes=payload.get("attributes", {}),
                snippet=desc,
            )
        )

    return results
