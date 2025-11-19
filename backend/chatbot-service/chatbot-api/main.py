from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os

app = FastAPI()
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://ollama:11434")


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


@app.get("/")
def health():
    return {"status": "ok", "service": "chatbot-api"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "messages": [
                {"role": "user", "content": request.prompt}
            ]
        }
    )

    data = resp.json()
    answer = data.get("message", {}).get("content", "")

    return ChatResponse(response=answer)

