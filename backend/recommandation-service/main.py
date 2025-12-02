from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.recommendations import router as recommendations_router
from app.routes.webhook import router as webhook_router


app = FastAPI(
    title="Recommendation Service",
    description="Product recommendation service using vector similarity",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(health_router)
app.include_router(recommendations_router)
app.include_router(webhook_router)
