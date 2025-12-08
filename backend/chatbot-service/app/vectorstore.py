from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    MatchAny,
)
import logging

from .config import QDRANT_URL, QDRANT_COLLECTION
from .embeddings import embed
from .models import ProductVariant, SearchResult

logger = logging.getLogger(__name__)


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
    parts = [variant.product_name or "", variant.product_description or ""]

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


def query_similar(
    query_text: str,
    limit: int = 5,
    min_score: float = 0.3,
    score_threshold_ratio: float = 0.7,
    category_ids: Optional[List[int]] = None,
) -> List[SearchResult]:
    """
    Search for similar product variants across all shops.

    Args:
        query_text: Search query
        limit: Maximum number of results
        min_score: Minimum similarity score (0.0-1.0). Default 0.3
        score_threshold_ratio: Only return results within this ratio of top score. Default 0.7
        category_ids: Optional list of category IDs to filter by
    """
    ensure_collection()
    q_vec = embed(query_text)
    search_limit = max(1, min(limit, 50))

    # Build filter if category_ids provided
    query_filter = None
    if category_ids:
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="category_id",
                    match=MatchAny(any=category_ids),
                )
            ]
        )

    if hasattr(qdrant, "search"):
        raw = qdrant.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=q_vec,
            query_filter=query_filter,
            limit=search_limit,
            with_payload=True,
        )
        points = raw
    else:
        raw = qdrant.query_points(
            collection_name=QDRANT_COLLECTION,
            query=q_vec,
            query_filter=query_filter,
            limit=search_limit,
            with_payload=True,
        )
        points = raw.points

    results: List[SearchResult] = []
    top_score = None

    for r in points:
        payload = getattr(r, "payload", {}) or {}
        score = getattr(r, "score", None)

        if score is None:
            continue

        score_float = float(score)

        # Track top score for adaptive threshold
        if top_score is None:
            top_score = score_float

        # Apply minimum score filter
        if score_float < min_score:
            continue

        # Apply adaptive threshold (only keep results within X% of top score)
        if score_threshold_ratio and top_score:
            threshold = top_score * score_threshold_ratio
            if score_float < threshold:
                continue

        desc = (payload.get("product_description") or "")[:220]

        # Convert price string back to Decimal
        from decimal import Decimal

        price_str = payload.get("price")
        price = Decimal(price_str) if price_str else None

        results.append(
            SearchResult(
                id=payload.get("variant_id", getattr(r, "id", 0)),
                score=score_float,
                sku=payload.get("sku"),
                product_name=payload.get("product_name"),
                price=price,
                stock=payload.get("stock"),
                attributes=payload.get("attributes", {}),
                snippet=desc,
            )
        )

    return results


def query_similar_by_shop(
    query_text: str,
    shop_id: int,
    limit: int = 5,
    min_score: float = 0.3,
    score_threshold_ratio: float = 0.7,
    category_ids: Optional[List[int]] = None,
) -> List[SearchResult]:
    """
    Search for similar product variants filtered by shop_id.
    Only returns results from the specified shop.

    Args:
        query_text: Search query
        shop_id: Filter results to this shop
        limit: Maximum number of results
        min_score: Minimum similarity score (0.0-1.0). Default 0.3
        score_threshold_ratio: Only return results within this ratio of top score. Default 0.7
        category_ids: Optional list of category IDs to filter by
    """
    ensure_collection()
    q_vec = embed(query_text)
    search_limit = max(1, min(limit, 50))

    # Build filter conditions
    filter_conditions = [FieldCondition(key="shop_id", match=MatchValue(value=shop_id))]

    # Add category filter if provided
    if category_ids:
        filter_conditions.append(
            FieldCondition(
                key="category_id",
                match=MatchAny(any=category_ids),
            )
        )

    shop_filter = Filter(must=filter_conditions)  # type: ignore[arg-type]

    if hasattr(qdrant, "search"):
        raw = qdrant.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=q_vec,
            query_filter=shop_filter,
            limit=search_limit,
            with_payload=True,
        )
        points = raw
    else:
        raw = qdrant.query_points(
            collection_name=QDRANT_COLLECTION,
            query=q_vec,
            query_filter=shop_filter,
            limit=search_limit,
            with_payload=True,
        )
        points = raw.points

    results: List[SearchResult] = []
    top_score = None

    for r in points:
        payload = getattr(r, "payload", {}) or {}
        score = getattr(r, "score", None)

        if score is None:
            continue

        score_float = float(score)

        # Track top score for adaptive threshold
        if top_score is None:
            top_score = score_float

        # Apply minimum score filter
        if score_float < min_score:
            continue

        # Apply adaptive threshold (only keep results within X% of top score)
        if score_threshold_ratio and top_score:
            threshold = top_score * score_threshold_ratio
            if score_float < threshold:
                continue

        desc = (payload.get("product_description") or "")[:220]

        # Convert price string back to Decimal
        from decimal import Decimal

        price_str = payload.get("price")
        price = Decimal(price_str) if price_str else None

        results.append(
            SearchResult(
                id=payload.get("variant_id", getattr(r, "id", 0)),
                score=score_float,
                sku=payload.get("sku"),
                product_name=payload.get("product_name"),
                price=price,
                stock=payload.get("stock"),
                attributes=payload.get("attributes", {}),
                snippet=desc,
            )
        )

    return results
