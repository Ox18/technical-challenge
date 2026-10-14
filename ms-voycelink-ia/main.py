import logging
import os
import random
import time
import uuid

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "ia-internal-key")
FAIL_RATE = float(os.getenv("FAIL_RATE", "0.2"))
SLOW_RATE = float(os.getenv("SLOW_RATE", "0.2"))
SLOW_SECONDS = float(os.getenv("SLOW_SECONDS", "8"))

logging.basicConfig(level=logging.INFO, format="%(asctime)s ia %(levelname)s %(message)s")
log = logging.getLogger("ia")

app = FastAPI(title="ms-voycelink-ia (simulado)")

REASONS = {
    "headset_required": "No headset detected",
    "plain_background": "Background is not plain",
    "dress_code": "Shirt does not meet the dress code",
    "face_visible": "Face is not fully visible",
}


class ValidateRequest(BaseModel):
    image: str
    rules: dict[str, bool]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/validate")
def validate(body: ValidateRequest, request: Request, x_internal_key: str | None = Header(default=None)):
    request_id = request.headers.get("x-request-id", "-")
    started = time.monotonic()

    if x_internal_key != INTERNAL_API_KEY:
        log.warning("request_id=%s unauthorized", request_id)
        raise HTTPException(status_code=401, detail="Invalid internal key")

    if not body.image:
        raise HTTPException(status_code=422, detail="image is required")

    if random.random() < SLOW_RATE:
        time.sleep(SLOW_SECONDS)

    if random.random() < FAIL_RATE:
        log.error("request_id=%s upstream failure", request_id)
        return PlainTextResponse(
            status_code=500,
            content=(
                "Traceback (most recent call last):\n"
                '  File "/srv/ia/adjudicator.py", line 214, in adjudicate\n'
                "    resp = client.chat.completions.create(model=\"gpt-4o-vision\", ...)\n"
                "openai.APIConnectionError: Connection to "
                "https://voycelink-ia-prod.openai.azure.com failed "
                "(deployment=vlm-compliance, api_key=sk-***redacted***)\n"
            ),
        )

    active = [rule for rule, enabled in body.rules.items() if enabled]
    violations = [
        {"rule": rule, "reason": REASONS.get(rule, f"Rule {rule} not met")}
        for rule in active
        if random.random() < 0.35
    ]
    elapsed_ms = int((time.monotonic() - started) * 1000)
    log.info("request_id=%s rules=%s violations=%d elapsed_ms=%d", request_id, active, len(violations), elapsed_ms)

    return {
        "compliant": not violations,
        "violations": violations,
        "confidence": round(random.uniform(0.55, 0.99), 2),
        "model": "vlm-compliance-2026-09",
        "trace_id": str(uuid.uuid4()),
    }
