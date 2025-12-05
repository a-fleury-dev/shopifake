from fastapi import APIRouter
from ..models import SearchRequest, ShopSearchRequest, SearchResponse
from ..vectorstore import query_similar, query_similar_by_shop

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    """
    Search for similar product variants across all shops.
    """
    results = query_similar(req.query, req.top_k)
    return SearchResponse(results=results)


@router.post("/search/shop", response_model=SearchResponse)
def search_by_shop(req: ShopSearchRequest):
    """
    Search for similar product variants within a specific shop.
    Only returns results from the specified shop_id.
    """
    results = query_similar_by_shop(req.query, req.shop_id, req.top_k)
    return SearchResponse(results=results)
