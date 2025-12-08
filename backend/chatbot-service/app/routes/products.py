from fastapi import APIRouter, HTTPException
from ..models import IndexProductVariantsRequest
from ..vectorstore import upsert_product_variants

router = APIRouter()


@router.post("/index-product-variants")
def index_product_variants(req: IndexProductVariantsRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="No product variants provided")
    count = upsert_product_variants(req.items)
    return {"indexed": count}
