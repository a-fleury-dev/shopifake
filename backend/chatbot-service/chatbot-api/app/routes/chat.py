from fastapi import APIRouter
from ..models import ChatRequest, ChatResponse
from ..system_prompts import SYSTEM_PROMPT
from ..llm import chat_complete

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    answer = chat_complete(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=request.prompt,
        json_mode=False,
        temperature=0.7,
    )
    return ChatResponse(response=answer)
