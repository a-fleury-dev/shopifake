from fastapi import APIRouter, HTTPException
from ..models import IndexProductsRequest
from ..vectorstore import upsert_products

router = APIRouter()


@router.post("/index-products")
def index_products(req: IndexProductsRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="No products provided")
    count = upsert_products(req.items)
    return {"indexed": count}
