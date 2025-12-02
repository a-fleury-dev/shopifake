from fastapi import APIRouter, HTTPException, Query

from app.models import (
    RecommendationRequest,
    RecommendationResponse,
    Product,
    IndexProductsRequest,
    IndexProductsResponse,
)
from app.vectorstore import (
    recommend_by_product,
    recommend_by_text,
    get_product_by_id,
    upsert_products,
)
from app.config import DEFAULT_RECOMMENDATIONS, MAX_RECOMMENDATIONS

router = APIRouter(prefix="/api/v1", tags=["recommendations"])


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations based on either a product ID or text query.

    - **product_id**: Get recommendations similar to this product
    - **query**: Get recommendations based on text description
    - **limit**: Number of recommendations (1-10)

    Note: Either product_id or query must be provided, but not both.
    """
    # Validate input
    if not request.product_id and not request.query:
        raise HTTPException(
            status_code=400, detail="Either 'product_id' or 'query' must be provided"
        )

    if request.product_id and request.query:
        raise HTTPException(
            status_code=400, detail="Provide either 'product_id' or 'query', not both"
        )

    # Validate limit
    limit = max(1, min(request.limit, MAX_RECOMMENDATIONS))

    # Get recommendations
    if request.product_id:
        recommendations = recommend_by_product(request.product_id, limit=limit)
        query_type = "product"
    else:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        recommendations = recommend_by_text(request.query, limit=limit)
        query_type = "text"

    return RecommendationResponse(
        recommendations=recommendations, query_type=query_type
    )


@router.get(
    "/recommendations/product/{product_id}", response_model=RecommendationResponse
)
async def get_recommendations_by_product(
    product_id: str,
    limit: int = Query(default=DEFAULT_RECOMMENDATIONS, ge=1, le=MAX_RECOMMENDATIONS),
):
    """
    Get product recommendations similar to a specific product.

    - **product_id**: The ID of the product to base recommendations on
    - **limit**: Number of recommendations to return (default: 5, max: 10)
    """
    recommendations = recommend_by_product(product_id, limit=limit)

    if not recommendations:
        raise HTTPException(
            status_code=404,
            detail=f"No recommendations found for product '{product_id}'. Product may not exist.",
        )

    return RecommendationResponse(recommendations=recommendations, query_type="product")


@router.get("/recommendations/search", response_model=RecommendationResponse)
async def get_recommendations_by_query(
    q: str = Query(..., description="Search query for product recommendations"),
    limit: int = Query(default=DEFAULT_RECOMMENDATIONS, ge=1, le=MAX_RECOMMENDATIONS),
):
    """
    Get product recommendations based on a text query.

    - **q**: Text description of desired products
    - **limit**: Number of recommendations to return (default: 5, max: 10)
    """
    if not q or not q.strip():
        raise HTTPException(
            status_code=400, detail="Query parameter 'q' cannot be empty"
        )

    recommendations = recommend_by_text(q, limit=limit)

    if not recommendations:
        raise HTTPException(
            status_code=404, detail="No recommendations found for the given query"
        )

    return RecommendationResponse(recommendations=recommendations, query_type="text")


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """
    Get details for a specific product.

    - **product_id**: The ID of the product to retrieve
    """
    product = get_product_by_id(product_id)

    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

    return product


@router.post("/products/index", response_model=IndexProductsResponse)
async def index_products(request: IndexProductsRequest):
    """
    Index products into the vector database for recommendations.

    - **items**: List of products to index

    This creates embeddings for each product and stores them in Qdrant.
    """
    if not request.items:
        raise HTTPException(status_code=400, detail="No products provided to index")

    try:
        count = upsert_products(request.items)
        return IndexProductsResponse(
            indexed_count=count, message=f"Successfully indexed {count} products"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error indexing products: {str(e)}"
        )
