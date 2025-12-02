from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import (
    FieldCondition,
    Filter,
    MatchValue,
    Distance,
    VectorParams,
    PointStruct,
)

from .config import QDRANT_URL, QDRANT_COLLECTION, MAX_RECOMMENDATIONS
from .embeddings import embed
from .models import Product


qdrant = QdrantClient(url=QDRANT_URL)


def ensure_collection() -> None:
    """Ensure the collection exists, create it if not."""
    collections = [c.name for c in qdrant.get_collections().collections]
    if QDRANT_COLLECTION in collections:
        return
    # Create collection with dimension from a test embedding
    dim = len(embed("dimension probe"))
    qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
    )


def product_text(p: Product) -> str:
    """Generate text representation of a product for embedding."""
    parts = [p.title or "", p.description or ""]
    if p.category:
        parts.append(f"Category: {p.category}")
    if p.tags:
        parts.append("Tags: " + ", ".join(p.tags))
    return "\n".join([s for s in parts if s]).strip()


def upsert_products(items: List[Product]) -> int:
    """
    Index products into Qdrant.

    Args:
        items: List of products to index

    Returns:
        Number of products indexed
    """
    ensure_collection()
    points: List[PointStruct] = []

    for idx, item in enumerate(items, start=1):
        vec = embed(product_text(item))
        points.append(
            PointStruct(
                id=idx,
                vector=vec,
                payload={
                    "product_id": item.id,
                    "title": item.title,
                    "description": item.description,
                    "tags": item.tags,
                    "price": item.price,
                    "category": item.category,
                    "image_url": item.image_url,
                },
            )
        )

    qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points)
    return len(points)


def get_product_by_id(product_id: str) -> Optional[Product]:
    """
    Retrieve a product from Qdrant by its product_id.

    Args:
        product_id: The product ID to search for

    Returns:
        Product object if found, None otherwise
    """
    try:
        # Search for the product by filtering on product_id
        results = qdrant.scroll(
            collection_name=QDRANT_COLLECTION,
            scroll_filter=Filter(
                must=[
                    FieldCondition(key="product_id", match=MatchValue(value=product_id))
                ]
            ),
            limit=1,
            with_payload=True,
            with_vectors=False,
        )

        if results[0]:  # results is a tuple (points, next_page_offset)
            point = results[0][0]
            payload = point.payload
            return Product(
                id=payload.get("product_id", ""),
                title=payload.get("title"),
                description=payload.get("description"),
                tags=payload.get("tags"),
                price=payload.get("price"),
                category=payload.get("category"),
                image_url=payload.get("image_url"),
            )
    except Exception as e:
        print(f"Error retrieving product {product_id}: {e}")

    return None


def get_product_vector(product_id: str) -> Optional[List[float]]:
    """
    Get the embedding vector for a product by its ID.

    Args:
        product_id: The product ID

    Returns:
        Embedding vector if found, None otherwise
    """
    try:
        results = qdrant.scroll(
            collection_name=QDRANT_COLLECTION,
            scroll_filter=Filter(
                must=[
                    FieldCondition(key="product_id", match=MatchValue(value=product_id))
                ]
            ),
            limit=1,
            with_payload=False,
            with_vectors=True,
        )

        if results[0]:
            point = results[0][0]
            vector = point.vector
            # Ensure we return list[float]
            if isinstance(vector, list) and not isinstance(
                vector[0] if vector else None, list
            ):
                return [float(x) for x in vector]
    except Exception as e:
        print(f"Error retrieving vector for product {product_id}: {e}")

    return None


def find_similar_products(
    query_vector: List[float], limit: int = 5, exclude_id: Optional[str] = None
) -> List[Product]:
    """
    Find similar products based on a query vector.

    Args:
        query_vector: The embedding vector to search with
        limit: Maximum number of results
        exclude_id: Optional product ID to exclude from results

    Returns:
        List of similar products with similarity scores
    """
    limit = max(1, min(limit, MAX_RECOMMENDATIONS))

    # If we need to exclude a product, fetch one extra and filter it out
    search_limit = limit + 1 if exclude_id else limit

    try:
        if hasattr(qdrant, "search"):
            results = qdrant.search(
                collection_name=QDRANT_COLLECTION,
                query_vector=query_vector,
                limit=search_limit,
                with_payload=True,
            )
        else:
            results = qdrant.query_points(
                collection_name=QDRANT_COLLECTION,
                query=query_vector,
                limit=search_limit,
                with_payload=True,
            ).points

        products = []
        for point in results:
            payload = point.payload
            if not payload:
                continue

            product_id = payload.get("product_id", "")

            # Skip the excluded product
            if exclude_id and product_id == exclude_id:
                continue

            products.append(
                Product(
                    id=product_id,
                    title=payload.get("title"),
                    description=payload.get("description"),
                    tags=payload.get("tags"),
                    price=payload.get("price"),
                    category=payload.get("category"),
                    image_url=payload.get("image_url"),
                    score=float(point.score) if hasattr(point, "score") else None,
                )
            )

            # Stop when we have enough results
            if len(products) >= limit:
                break

        return products

    except Exception as e:
        print(f"Error finding similar products: {e}")
        return []


def recommend_by_product(product_id: str, limit: int = 5) -> List[Product]:
    """
    Recommend products similar to a given product.

    Args:
        product_id: The product ID to base recommendations on
        limit: Number of recommendations to return

    Returns:
        List of recommended products
    """
    vector = get_product_vector(product_id)
    if not vector:
        return []

    return find_similar_products(vector, limit=limit, exclude_id=product_id)


def recommend_by_text(query: str, limit: int = 5) -> List[Product]:
    """
    Recommend products based on a text query.

    Args:
        query: Text description of desired products
        limit: Number of recommendations to return

    Returns:
        List of recommended products
    """
    if not query or not query.strip():
        return []

    vector = embed(query)
    return find_similar_products(vector, limit=limit)
