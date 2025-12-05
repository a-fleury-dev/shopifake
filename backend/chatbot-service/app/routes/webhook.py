from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import logging

from ..vectorstore import upsert_products
from ..models import Product

logger = logging.getLogger(__name__)

router = APIRouter()


class WebhookProduct(BaseModel):
    """Product received via webhook"""

    id: int
    category_id: int
    shop_id: int
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool = True


class ProductWebhookPayload(BaseModel):
    """Payload du webhook pour les produits"""

    event: Literal["product.created", "product.updated", "product.deleted"]
    timestamp: str
    data: WebhookProduct


@router.post("/webhook/product")
async def product_webhook(payload: ProductWebhookPayload):
    """
    Webhook to receive product change notifications.

    Supported events:
    - product.created: New product created
    - product.updated: Product updated
    - product.deleted: Product deleted

    Example payload:
    ```json
    {
        "event": "product.created",
        "timestamp": "2025-11-25T10:30:00Z",
        "data": {
            "id": 123,
            "category_id": 1,
            "shop_id": 1,
            "name": "Organic T-Shirt",
            "slug": "organic-t-shirt",
            "description": "T-shirt made from organic cotton",
            "is_active": true
        }
    }
    ```
    """
    logger.info(
        f"Received webhook event: {payload.event} for product {payload.data.id}"
    )

    try:
        if payload.event == "product.deleted":
            # For deletion, we could implement actual removal
            # For now we just log it
            logger.info(
                f"Product {payload.data.id} deleted (not removing from vector DB)"
            )
            return {
                "status": "acknowledged",
                "event": payload.event,
                "product_id": payload.data.id,
                "action": "logged",
            }

        elif payload.event in ["product.created", "product.updated"]:
            # Convert webhook product to Product format
            product = Product(
                id=payload.data.id,
                category_id=payload.data.category_id,
                shop_id=payload.data.shop_id,
                name=payload.data.name,
                slug=payload.data.slug,
                description=payload.data.description or "",
                is_active=payload.data.is_active,
            )

            # Update in vector database
            upsert_products([product])

            action = "indexed" if payload.event == "product.created" else "updated"
            logger.info(f"Product {payload.data.id} successfully {action} in vector DB")

            return {
                "status": "success",
                "event": payload.event,
                "product_id": payload.data.id,
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
    """Health check pour le webhook endpoint"""
    return {"status": "ok", "service": "webhook", "endpoints": ["/webhook/product"]}
