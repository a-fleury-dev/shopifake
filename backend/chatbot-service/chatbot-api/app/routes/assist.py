from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import requests
import json
import re

from ..models import SearchResult
from ..vectorstore import query_similar
from ..system_prompts import SYSTEM_PROMPT, INTENT_PROMPT
from ..config import OLLAMA_HOST


router = APIRouter()


class AssistRequest(BaseModel):
    prompt: str
    top_k: int = 5


class AssistResponse(BaseModel):
    response: str
    results: List[SearchResult] = []
    intent: str


def detect_intent(prompt: str) -> str:
    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "format": "json",
            "options": {"temperature": 0},
            "messages": [
                {"role": "system", "content": INTENT_PROMPT},
                {"role": "user", "content": prompt},
            ],
        },
        timeout=60,
    )
    raw = resp.json().get("message", {}).get("content", "").strip()
    # Try strict JSON first
    try:
        data = json.loads(raw)
        label = str(data.get("intent", "other")).lower()
    except Exception:
        # Fallback: regex for allowed tokens
        m = re.search(r"\b(faq|product_search|other)\b", raw.lower())
        label = m.group(1) if m else "other"
    # Heuristic override: detect obvious product terms
    if label != "product_search":
        terms = ["t-shirt", "shirt", "shoes", "sneaker", "cap", "hoodie", "socks", "cotton", "organic", "size", "price"]
        low = prompt.lower()
        if any(t in low for t in terms):
            label = "product_search"
    return label


def format_results(results: List[SearchResult]) -> str:
    if not results:
        return "No relevant products found."
    lines = []
    for i, r in enumerate(results, start=1):
        # Price is not part of SearchResult; to include it we would extend the model.
        lines.append(f"{i}. {r.title or 'Untitled'}\n   {r.snippet or ''}")
    return "\n".join(lines)


@router.post("/assist", response_model=AssistResponse)
def assist(req: AssistRequest):
    intent = detect_intent(req.prompt)
    results: List[SearchResult] = []

    if intent == "product_search":
        try:
            results = query_similar(req.prompt, req.top_k)
        except Exception:
            # If vector search fails, degrade gracefully to plain chat
            results = []

    context_block = ""  # prepared context to inject for LLM
    if results:
        formatted = format_results(results)
        context_block = (
            "You have access to the following top matching products (do not invent details):\n"
            f"{formatted}\n\n"
            "When answering, cite 2–4 of the most relevant items by name and keep it concise."
        )

    system = SYSTEM_PROMPT
    if context_block:
        system = SYSTEM_PROMPT + "\n\nContext:\n" + context_block

    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": "deepseek-r1:1.5b",
            "stream": False,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": req.prompt},
            ],
        },
        timeout=120,
    )
    data = resp.json()
    answer = data.get("message", {}).get("content", "")

    return AssistResponse(response=answer, results=results, intent=intent)
