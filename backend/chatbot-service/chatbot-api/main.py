from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.products import router as products_router
from app.routes.search import router as search_router
from app.routes.chat import router as chat_router
from app.routes.intent import router as intent_router


app = FastAPI()

# Mount all routers
app.include_router(health_router)
app.include_router(products_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(intent_router)

