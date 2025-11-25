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

    if "product_search" in raw.lower():
        label = "product_search"
    elif "faq" in raw.lower():
        label = "faq"
    else:
        label = "other"
    # Try strict JSON first
    # try:
    #     data = json.loads(raw)
    #     label = str(data.get("intent", "other")).lower()
    # except Exception:
    #     # Fallback: regex for allowed tokens
    #     m = re.search(r"\b(faq|product_search|other)\b", raw.lower())
    #     label = m.group(1) if m else "other"

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
    system = SYSTEM_PROMPT

    # Handle different intents with specific behavior
    if intent == "product_search":
        # For product search: retrieve products and adapt system prompt
        try:
            results = query_similar(req.prompt, req.top_k)
        except Exception:
            # If vector search fails, degrade gracefully to plain chat
            results = []

        if results:
            formatted = format_results(results)
            context_block = (
                "You have access to the following top matching products (do not invent details):\n"
                f"{formatted}\n\n"
                "When answering, cite 2–4 of the most relevant items by name and keep it concise."
            )
            system = SYSTEM_PROMPT + "\n\nContext:\n" + context_block
        else:
            # No products found - ask for more details
            system = (
                SYSTEM_PROMPT + "\n\n"
                "No matching products were found. Ask the customer for more specific details "
                "such as category, price range, size, color, or intended use to help narrow down the search."
            )

    elif intent == "faq":
        # For FAQ: focus on store policies and general information
        system = (
            SYSTEM_PROMPT + "\n\n"
            "The customer is asking about store policies or general information. "
            "Provide helpful answers about:\n"
            "- Shipping: Standard (5-7 days, free over $50), Express (2-3 days, $15)\n"
            "- Returns: 30-day return policy, items must be unused with tags\n"
            "- Payment: We accept all major credit cards, PayPal, and Apple Pay\n"
            "- Order tracking: Available via email confirmation link or account dashboard\n"
            "- Customer service: Available Mon-Fri 9am-6pm via chat or email\n"
            "Keep your answer concise and helpful."
        )

    else:  # intent == "other"
        # For other: keep conversation friendly but redirect to useful topics
        system = (
            SYSTEM_PROMPT + "\n\n"
            "The customer's message is a greeting or off-topic. "
            "Respond politely and guide them toward either browsing products or asking about store policies. "
            "Keep it brief and welcoming."
        )

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
