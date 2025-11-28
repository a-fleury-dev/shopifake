from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import logging

from ..vectorstore import upsert_products
from ..models import Product

logger = logging.getLogger(__name__)

router = APIRouter()


class WebhookProduct(BaseModel):
    """Produit reçu via webhook"""

    id: str
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None


class ProductWebhookPayload(BaseModel):
    """Payload du webhook pour les produits"""

    event: Literal["product.created", "product.updated", "product.deleted"]
    timestamp: str
    data: WebhookProduct


@router.post("/webhook/product")
async def product_webhook(payload: ProductWebhookPayload):
    """
    Webhook pour recevoir les notifications de changement de produit.

    Events supportés:
    - product.created: Nouveau produit créé
    - product.updated: Produit mis à jour
    - product.deleted: Produit supprimé

    Exemple de payload:
    ```json
    {
        "event": "product.created",
        "timestamp": "2025-11-25T10:30:00Z",
        "data": {
            "id": "prod-123",
            "title": "T-shirt Bio",
            "description": "T-shirt en coton biologique",
            "price": 29.99,
            "category": "vetements"
        }
    }
    ```
    """
    logger.info(
        f"Received webhook event: {payload.event} for product {payload.data.id}"
    )

    try:
        if payload.event == "product.deleted":
            # Pour la suppression, on pourrait implémenter une vraie suppression
            # Pour l'instant on log juste
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
            # Conversion du produit webhook vers le format Product
            product = Product(
                id=payload.data.id,
                title=payload.data.title,
                description=payload.data.description or "",
                price=payload.data.price,
                category=payload.data.category,
                image_url=payload.data.image_url,
            )

            # Mise à jour dans la base vectorielle
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
