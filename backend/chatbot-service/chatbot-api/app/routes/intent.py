from fastapi import APIRouter
import requests
import json
import re
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
            "format": "json",
            "options": {"temperature": 0},
            "messages": [
                {"role": "system", "content": INTENT_PROMPT},
                {"role": "user", "content": req.prompt},
            ],
        },
        timeout=60,
    )
    raw = resp.json().get("message", {}).get("content", "").strip()
    try:
        data = json.loads(raw)
        label = str(data.get("intent", "other")).lower()
    except Exception:
        m = re.search(r"\b(faq|product_search|other)\b", raw.lower())
        label = m.group(1) if m else "other"
    return {"intent": label}
