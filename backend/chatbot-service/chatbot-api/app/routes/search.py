from fastapi import APIRouter
from ..models import SearchRequest, SearchResponse
from ..vectorstore import query_similar

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    results = query_similar(req.query, req.top_k)
    return SearchResponse(results=results)
