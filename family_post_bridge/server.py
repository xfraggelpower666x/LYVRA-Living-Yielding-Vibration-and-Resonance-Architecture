"""LYVRA Family Post Bridge: isolated, read-only bootstrap.

No Google Drive access, message storage, automatic messaging or cross-system
mutation is enabled until separately authorized and verified.
"""
from fastapi import FastAPI, HTTPException

app = FastAPI(
    title="LYVRA Family Post Bridge",
    version="0.1.0-readonly-bootstrap",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.get("/health")
def health():
    return {
        "service": "lyvra-family-post-bridge",
        "status": "up",
        "mode": "READ_ONLY_BOOTSTRAP",
        "google_drive": "NOT_CONNECTED",
        "little_lyv_peer": "NOT_CONNECTED",
        "post_detection": "NOT_ACTIVE",
        "message_writes": False,
        "paid_fallback": False,
    }


@app.get("/api/family-post/status")
def family_post_status():
    # A missing source MUST NOT be presented as an empty inbox.
    raise HTTPException(
        status_code=503,
        detail={
            "code": "FAMILY_MAIL_SOURCE_NOT_CONFIGURED",
            "message": "No mailbox access or read-receipt authority has been configured.",
            "mailbox_empty": None,
            "post_detection": "UNVERIFIED",
        },
    )
