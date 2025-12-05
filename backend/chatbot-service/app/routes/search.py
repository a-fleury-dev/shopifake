from fastapi import APIRouter
from ..models import SearchRequest, ShopSearchRequest, SearchResponse
from ..vectorstore import query_similar, query_similar_by_shop

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    """
    Search for similar product variants across all shops.
    
    Parameters:
    - query: Search text
    - top_k: Max results to return (default: 5)
    - min_score: Minimum similarity score 0.0-1.0 (default: 0.6)
    - score_threshold_ratio: Only return results within X% of top score (default: 0.8)
    - category_ids: Optional category filter
    
    Returns empty list if no products meet the score thresholds.
    """
    results = query_similar(
        req.query, 
        req.top_k,
        req.min_score or 0.6,
        req.score_threshold_ratio or 0.8,
        req.category_ids
    )
    return SearchResponse(results=results)


@router.post("/search/shop", response_model=SearchResponse)
def search_by_shop(req: ShopSearchRequest):
    """
    Search for similar product variants within a specific shop.
    Only returns results from the specified shop_id.
    
    Parameters:
    - query: Search text
    - shop_id: Filter to this shop
    - top_k: Max results to return (default: 5)
    - min_score: Minimum similarity score 0.0-1.0 (default: 0.6)
    - score_threshold_ratio: Only return results within X% of top score (default: 0.8)
    - category_ids: Optional category filter
    
    Returns empty list if no products meet the score thresholds.
    """
    results = query_similar_by_shop(
        req.query, 
        req.shop_id, 
        req.top_k,
        req.min_score or 0.6,
        req.score_threshold_ratio or 0.8,
        req.category_ids
    )
    return SearchResponse(results=results)
