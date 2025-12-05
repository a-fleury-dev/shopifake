from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from decimal import Decimal


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


class ProductVariant(BaseModel):
    """
    ProductVariant for chatbot indexing and search.
    Combines variant data with parent product information for semantic search.
    """
    # Variant fields
    id: int  # Variant ID from database
    product_id: int
    shop_id: int
    sku: str
    price: Decimal
    stock: int = 0
    is_active: bool = True
    
    # Product fields (for semantic search)
    product_name: str
    product_slug: str
    product_description: Optional[str] = None
    category_id: int
    
    # Variant attributes (e.g., {"color": "blue", "size": "M"})
    attributes: Dict[str, str] = Field(default_factory=dict)


class IndexProductVariantsRequest(BaseModel):
    items: List[ProductVariant]


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    min_score: Optional[float] = 0.3  # Minimum similarity score (0.0 to 1.0) - lowered default
    score_threshold_ratio: Optional[float] = 0.7  # Only return results within X% of top score - lowered
    category_ids: Optional[List[int]] = None  # Optional category filter


class ShopSearchRequest(BaseModel):
    query: str
    shop_id: int
    top_k: int = 5
    min_score: Optional[float] = 0.3  # Lowered default
    score_threshold_ratio: Optional[float] = 0.7  # Lowered
    category_ids: Optional[List[int]] = None


class SearchResult(BaseModel):
    id: int  # Variant ID
    score: float
    sku: Optional[str] = None
    product_name: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    attributes: Optional[Dict[str, str]] = None
    snippet: Optional[str] = None


class SearchResponse(BaseModel):
    results: List[SearchResult]
