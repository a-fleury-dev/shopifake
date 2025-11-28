from typing import Optional, Any
from fastapi import HTTPException

try:
    from openai import OpenAI  # type: ignore
except Exception:  # pragma: no cover - import error handled at runtime
    OpenAI = None  # type: ignore

from .config import OPENAI_API_KEY, OPENAI_MODEL


def _get_client() -> Any:
    if OpenAI is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "OpenAI SDK not installed. Ensure 'openai' is in requirements and installed."
            ),
        )
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail=(
                "OPENAI_API_KEY is not set. Set environment variable to use the ChatGPT API."
            ),
        )
    return OpenAI(api_key=OPENAI_API_KEY)


def chat_complete(
    *,
    system_prompt: str,
    user_prompt: str,
    json_mode: bool = False,
    temperature: float = 0.7,
    model: Optional[str] = None,
) -> str:
    """
    Call OpenAI Responses API and return the assistant's message text.

    Parameters
    - system_prompt: Content for the system role
    - user_prompt: Content for the user role
    - json_mode: If True, request a JSON object response
    - temperature: Sampling temperature
    - model: Override model name (defaults to OPENAI_MODEL)
    """
    client = _get_client()

    try:
        # If json_mode is requested, steer the model via instructions instead of using
        # response_format (not supported on Responses API in this SDK version).
        if json_mode:
            system_prompt = (
                system_prompt
                + "\n\nRespond ONLY with a JSON object containing an 'intent' key whose value is one of: 'product_search', 'faq', or 'other'."
            )

        # Some models do not support 'temperature'. Try with temperature first,
        # and if the API rejects it, retry without temperature.
        try:
            resp = client.responses.create(
                model=model or OPENAI_MODEL,
                input=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=temperature,
            )
        except Exception as inner:
            msg = str(inner)
            if ("Unsupported parameter" in msg or "invalid_request_error" in msg) and (
                "temperature" in msg
            ):
                resp = client.responses.create(
                    model=model or OPENAI_MODEL,
                    input=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                )
            else:
                raise inner

        # responses API provides handy output_text aggregation
        return getattr(resp, "output_text", "") or ""
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM service error: {e}")
