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
