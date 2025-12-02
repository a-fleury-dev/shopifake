from fastapi import APIRouter, HTTPException, Header
from typing import Optional, Literal
from pydantic import BaseModel

from app.models import Product
from app.vectorstore import upsert_products, get_product_by_id

router = APIRouter(prefix="/api/v1/webhook", tags=["webhook"])


class WebhookEvent(BaseModel):
    """Webhook event from product service"""

    event_type: Literal["product.created", "product.updated", "product.deleted"]
    product: Optional[Product] = None
    product_id: Optional[str] = None


class WebhookResponse(BaseModel):
    """Response for webhook events"""

    success: bool
    message: str
    event_type: str


@router.post("/products", response_model=WebhookResponse)
async def handle_product_webhook(
    event: WebhookEvent, x_webhook_secret: Optional[str] = Header(None)
):
    """
    Webhook endpoint to receive product events from the product service.

    Supported events:
    - **product.created**: New product added, will be indexed
    - **product.updated**: Product modified, will be re-indexed
    - **product.deleted**: Product removed, will be deleted from index

    **Security**: Requires X-Webhook-Secret header (optional for now)
    """

    # TODO: Validate webhook secret in production
    # if x_webhook_secret != os.getenv("WEBHOOK_SECRET"):
    #     raise HTTPException(status_code=401, detail="Invalid webhook secret")

    try:
        if event.event_type in ["product.created", "product.updated"]:
            # Index or update the product
            if not event.product:
                raise HTTPException(
                    status_code=400,
                    detail="Product data required for create/update events",
                )

            # Index the single product
            count = upsert_products([event.product])

            action = "indexed" if event.event_type == "product.created" else "updated"
            return WebhookResponse(
                success=True,
                message=f"Product '{event.product.id}' successfully {action}",
                event_type=event.event_type,
            )

        elif event.event_type == "product.deleted":
            # Delete product from index
            if not event.product_id:
                raise HTTPException(
                    status_code=400, detail="Product ID required for delete events"
                )

            # TODO: Implement delete functionality in vectorstore
            # For now, just return success
            return WebhookResponse(
                success=True,
                message=f"Product '{event.product_id}' deletion acknowledged",
                event_type=event.event_type,
            )

        else:
            raise HTTPException(
                status_code=400, detail=f"Unknown event type: {event.event_type}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing webhook: {str(e)}"
        )


@router.get("/health")
async def webhook_health():
    """Health check for webhook endpoint"""
    return {"status": "healthy", "endpoint": "webhook"}
