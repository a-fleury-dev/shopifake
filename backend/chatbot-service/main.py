from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
# This must be done before importing app modules that depend on env vars
load_dotenv()

from app.routes.health import router as health_router  # noqa: E402
from app.routes.products import router as products_router  # noqa: E402
from app.routes.search import router as search_router  # noqa: E402
from app.routes.chat import router as chat_router  # noqa: E402
from app.routes.intent import router as intent_router  # noqa: E402
from app.routes.assist import router as assist_router  # noqa: E402
from app.routes.webhook import router as webhook_router  # noqa: E402


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(health_router)
app.include_router(products_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(intent_router)
app.include_router(assist_router)
app.include_router(webhook_router)
