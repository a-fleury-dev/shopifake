from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal, Dict
from decimal import Decimal
import logging

from ..vectorstore import upsert_product_variants
from ..models import ProductVariant

logger = logging.getLogger(__name__)

router = APIRouter()


class WebhookProductVariant(BaseModel):
    """Product variant received via webhook"""

    id: int
    product_id: int
    shop_id: int
    sku: str
    price: Decimal
    stock: int = 0
    is_active: bool = True
    
    # Product fields
    product_name: str
    product_slug: str
    product_description: Optional[str] = None
    category_id: int
    
    # Variant attributes
    attributes: Dict[str, str] = {}


class ProductVariantWebhookPayload(BaseModel):
    """Webhook payload for product variants"""

    event: Literal["variant.created", "variant.updated", "variant.deleted"]
    timestamp: str
    data: WebhookProductVariant


@router.post("/webhook/product-variant")
async def product_variant_webhook(payload: ProductVariantWebhookPayload):
    """
    Webhook to receive product variant change notifications.

    Supported events:
    - variant.created: New product variant created
    - variant.updated: Product variant updated
    - variant.deleted: Product variant deleted

    Example payload:
    ```json
    {
        "event": "variant.created",
        "timestamp": "2025-12-05T10:30:00Z",
        "data": {
            "id": 1,
            "product_id": 123,
            "shop_id": 1,
            "sku": "ORG-TSHIRT-BLU-M",
            "price": "29.99",
            "stock": 50,
            "is_active": true,
            "product_name": "Organic T-Shirt",
            "product_slug": "organic-t-shirt",
            "product_description": "T-shirt made from organic cotton",
            "category_id": 1,
            "attributes": {
                "color": "blue",
                "size": "M"
            }
        }
    }
    ```
    """
    logger.info(
        f"Received webhook event: {payload.event} for variant {payload.data.id}"
    )

    try:
        if payload.event == "variant.deleted":
            # For deletion, we could implement actual removal
            # For now we just log it
            logger.info(
                f"Variant {payload.data.id} deleted (not removing from vector DB)"
            )
            return {
                "status": "acknowledged",
                "event": payload.event,
                "variant_id": payload.data.id,
                "action": "logged",
            }

        elif payload.event in ["variant.created", "variant.updated"]:
            # Convert webhook variant to ProductVariant format
            variant = ProductVariant(
                id=payload.data.id,
                product_id=payload.data.product_id,
                shop_id=payload.data.shop_id,
                sku=payload.data.sku,
                price=payload.data.price,
                stock=payload.data.stock,
                is_active=payload.data.is_active,
                product_name=payload.data.product_name,
                product_slug=payload.data.product_slug,
                product_description=payload.data.product_description or "",
                category_id=payload.data.category_id,
                attributes=payload.data.attributes,
            )

            # Update in vector database
            upsert_product_variants([variant])

            action = "indexed" if payload.event == "variant.created" else "updated"
            logger.info(f"Variant {payload.data.id} successfully {action} in vector DB")

            return {
                "status": "success",
                "event": payload.event,
                "variant_id": payload.data.id,
                "action": action,
                "indexed": True,
            }

    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to process webhook: {str(e)}"
        )


@router.get("/webhook/health")
def webhook_health():
    """Health check for webhook endpoint"""
    return {"status": "ok", "service": "webhook", "endpoints": ["/webhook/product-variant"]}
