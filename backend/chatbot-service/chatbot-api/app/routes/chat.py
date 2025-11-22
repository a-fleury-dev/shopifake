from fastapi import APIRouter
import requests
from ..models import ChatRequest, ChatResponse
from ..system_prompts import SYSTEM_PROMPT
from ..config import OLLAMA_HOST

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.prompt},
            ],
        },
    )
    data = resp.json()
    answer = data.get("message", {}).get("content", "")
    return ChatResponse(response=answer)
