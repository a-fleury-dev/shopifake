from typing import List, Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


class Product(BaseModel):
    id: str  # original catalog id (string)
    title: str
    description: str
    tags: Optional[List[str]] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


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
