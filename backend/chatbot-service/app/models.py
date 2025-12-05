from typing import List, Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


class Product(BaseModel):
    id: int  # Product ID from database
    category_id: int
    shop_id: int
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool = True


class IndexProductsRequest(BaseModel):
    items: List[Product]


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    id: int  # Product ID
    score: float
    name: Optional[str] = None
    snippet: Optional[str] = None


class SearchResponse(BaseModel):
    results: List[SearchResult]
