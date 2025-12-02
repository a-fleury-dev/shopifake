from typing import List, Optional
from pydantic import BaseModel


class Product(BaseModel):
    """Product model matching the structure in Qdrant"""
    id: str
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    score: Optional[float] = None  # Similarity score


class RecommendationRequest(BaseModel):
    """Request for product recommendations"""
    product_id: Optional[str] = None  # Recommend based on a product ID
    query: Optional[str] = None  # Recommend based on text query
    limit: int = 5  # Number of recommendations


class RecommendationResponse(BaseModel):
    """Response with recommended products"""
    recommendations: List[Product]
    query_type: str  # "product" or "text"


class IndexProductsRequest(BaseModel):
    """Request to index products in Qdrant"""
    items: List[Product]


class IndexProductsResponse(BaseModel):
    """Response after indexing products"""
    indexed_count: int
    message: str
