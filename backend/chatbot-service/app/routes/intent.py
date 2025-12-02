from fastapi import APIRouter
from ..models import ChatRequest
from ..system_prompts import INTENT_PROMPT
from ..llm import chat_complete

router = APIRouter()


@router.post("/intent")
def detect_intent(req: ChatRequest):
    raw = chat_complete(
        system_prompt=INTENT_PROMPT,
        user_prompt=req.prompt,
        json_mode=True,
        temperature=0.0,
    ).strip()
    print(f"Intent detection raw response: {raw}")

    if "product_search" in raw.lower():
        label = "product_search"
    elif "faq" in raw.lower():
        label = "faq"
    else:
        label = "other"

    # try:
    #     data = json.loads(raw)
    #     label = str(data.get("intent", "other")).lower()
    # except Exception:
    #     m = re.search(r"\b(faq|product_search|other)\b", raw.lower())
    #     label = m.group(1) if m else "other"
    return {"intent": label}
