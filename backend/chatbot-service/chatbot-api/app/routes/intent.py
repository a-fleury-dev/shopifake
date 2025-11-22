from fastapi import APIRouter
import requests
from ..models import ChatRequest
from ..system_prompts import INTENT_PROMPT
from ..config import OLLAMA_HOST

router = APIRouter()


@router.post("/intent")
def detect_intent(req: ChatRequest):
    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "messages": [
                {"role": "system", "content": INTENT_PROMPT},
                {"role": "user", "content": req.prompt},
            ],
        },
    )
    label = resp.json().get("message", {}).get("content", "").strip().lower()
    return {"intent": label}
