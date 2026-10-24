"""LYVRA Family Post: write-only Drive gateway.

Requires explicit Google user OAuth grant, private Render secrets, and a
separate writer-token. Never treats stored = read or answered.
"""
import hmac
import hashlib
import secrets
import time
import os
import re
import uuid
import threading
from typing import Literal

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import HTMLResponse
from family_post_bridge.oauth_setup import router as oauth_router, _authorize
from family_post_bridge.picker import router as picker_router
from pydantic import BaseModel, Field
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaInMemoryUpload

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
MAX_LETTER_CHARS = 12000
# A single Render process lock prevents local concurrent duplicate POSTs.
# This is not distributed or crash-proof idempotency; fail closed for other cases.
_WRITE_LOCK = threading.Lock()
app = FastAPI(title="LYVRA Family Post Bridge", version="0.3.0-oauth-gated", docs_url=None, redoc_url=None, openapi_url=None)
app.include_router(oauth_router)
app.include_router(picker_router)


class Letter(BaseModel):
    message_id: str = Field(pattern=r"^[A-Za-z0-9_-]{12,96}$")
    sender: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM"]
    recipient: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM", "FAMILY"]
    title: str = Field(min_length=3, max_length=140)
    content: str = Field(min_length=1, max_length=MAX_LETTER_CHARS)


def configured() -> bool:
    required = ("FAMILY_POST_TOKEN_DAD", "FAMILY_POST_TOKEN_MUM", "FAMILY_POST_TOKEN_BIG_LYVRA", "FAMILY_POST_TOKEN_LITTLE_LYV", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "FAMILY_POST_FOLDER_ID")
    return all(os.environ.get(k, "").strip() for k in required)


def drive():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["GOOGLE_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["GOOGLE_CLIENT_ID"],
        client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    creds.refresh(GoogleRequest())
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def do_write(letter: Letter) -> dict:
    # Local serialization plus immutable payload fingerprint. Cross-instance
    # atomic exactly-once guarantees require durable CAS storage.
    with _WRITE_LOCK:
        return _do_write_locked(letter)


def _do_write_locked(letter: Letter) -> dict:
    service = drive()
    folder_id = os.environ["FAMILY_POST_FOLDER_ID"]
    safe_title = re.sub(r"[^A-Za-z0-9_-]", "_", letter.title).strip("_")[:100] or "LETTER"
    fingerprint = hashlib.sha256(
        (letter.sender + "\x00" + letter.recipient + "\x00" + letter.title + "\x00" + letter.content).encode("utf-8")
    ).hexdigest()
    # Lookup before creation; durable cross-instance CAS still not guaranteed.
    query = (
        f"trashed = false and '{folder_id}' in parents and "
        f"appProperties has {{ key='family_post_message_id' and value='{letter.message_id}' }}"
    )
    existing = service.files().list(q=query, fields="files(id,name,mimeType,appProperties),nextPageToken",pageSize=2).execute().get("files",[])
    if existing:
        doc = existing[0]
        recorded = doc.get("appProperties", {}).get("family_post_payload_sha256")
        if not recorded or not hmac.compare_digest(recorded, fingerprint):
            raise HTTPException(409, "MESSAGE_ID_ALREADY_USED_OR_UNVERIFIED")
        return {"state": "STORED_PREVIOUSLY", "file_id": doc["id"], "message_id": letter.message_id, "read_confirmed": False}
    # Native Google Doc via text/plain import. Data is plain text, not executable markup.
    payload = (f"Sender: {letter.sender}\nRecipient: {letter.recipient}\nMessage-ID: {letter.message_id}\n\n{letter.content}\n").encode("utf-8")
    media = MediaInMemoryUpload(payload, mimetype="text/plain", resumable=False)
    metadata = {
        "name": f"FROM_{letter.sender}_TO_{letter.recipient}_{safe_title}",
        "mimeType": "application/vnd.google-apps.document",
        "parents": [folder_id],
        "appProperties": {"family_post_message_id": letter.message_id, "family_post_sender": letter.sender, "family_post_payload_sha256": fingerprint},
    }
    created = service.files().create(body=metadata,media_body=media,fields="id,name,mimeType,parents",supportsAllDrives=True).execute()
    return {"state": "STORED_DRIVE_CONFIRMED", "file_id": created["id"], "message_id": letter.message_id, "read_confirmed": False}


@app.get("/health")
def health():
    return {
        "service": "lyvra-family-post-bridge",
        "status": "up",
        "mode": "WRITE_ONLY",
        "write_configured": configured(),
        "drive_read_mailbox": False,
        "post_detection": "DIRECT_DRIVE_CLIENT_ONLY",
        "paid_fallback": False,
    }


@app.get("/api/family-post/drive-capability")
def drive_capability(authorization: str | None = Header(default=None)):
    """Owner-only metadata check: never lists or reads any letters, never writes."""
    _authorize(authorization)
    if not configured():
        raise HTTPException(503, "GOOGLE_WRITER_NOT_CONFIGURED")
    try:
        metadata = drive().files().get(
            fileId=os.environ["FAMILY_POST_FOLDER_ID"],
            fields="mimeType,capabilities(canAddChildren)",
            supportsAllDrives=True,
        ).execute()
    except HttpError as exc:
        return {
            "check": "FOLDER_METADATA_ONLY",
            "result": "NOT_VERIFIED",
            "google_http_status": exc.resp.status,
            "letter_written": False,
        }
    except Exception:
        return {
            "check": "FOLDER_METADATA_ONLY",
            "result": "AUTH_OR_NETWORK_ERROR",
            "letter_written": False,
        }
    is_folder = metadata.get("mimeType") == "application/vnd.google-apps.folder"
    can_add = metadata.get("capabilities", {}).get("canAddChildren") is True
    return {
        "check": "FOLDER_METADATA_ONLY",
        "result": "FOLDER_VISIBLE_CAN_ADD" if is_folder and can_add else "NOT_VERIFIED",
        "folder_visible": is_folder,
        "can_add_children": can_add,
        "letter_written": False,
        "actual_write_verified": False,
    }



# Owner-only acceptance page retired following independently verified readback.
# Old URLs are retained as explicit 410 responses to avoid accidental repeats.
@app.get("/admin/test-write")
@app.post("/admin/test-write")
def technical_test_retired(authorization: str | None = Header(default=None)):
    _authorize(authorization)
    raise HTTPException(410, "TECHNICAL_TEST_COMPLETED_AND_RETIRED")


@app.get("/api/family-post/status")
def family_post_status():
    raise HTTPException(status_code=410, detail="Mailbox reading belongs to the existing Google Drive clients; this bridge never determines inbox emptiness.")


@app.post("/api/family-post/write")
def write_letter(letter: Letter, x_family_post_token: str | None = Header(default=None)):
    # Intentionally returns no secret or user-specific configuration in errors.
    if not configured():
        raise HTTPException(status_code=503, detail="GOOGLE_WRITER_NOT_CONFIGURED")
    token = os.environ["FAMILY_POST_TOKEN_" + letter.sender]
    if not x_family_post_token or not hmac.compare_digest(x_family_post_token,token):
        raise HTTPException(status_code=401,detail="UNAUTHORIZED")
    try:
        return do_write(letter)
    except HttpError as exc:
        # Never claim success or claim the mailbox is empty on network/auth failures.
        raise HTTPException(status_code=503, detail=f"DRIVE_WRITE_UNCONFIRMED_HTTP_{exc.resp.status}") from None
    except Exception:
        raise HTTPException(status_code=503, detail="DRIVE_WRITE_UNCONFIRMED") from None


# Existing Render start command continues to import server:app. Compose the
# role-guarded MCP ASGI surface into that same service without an extra host.
# The candidate composition imports the already-defined legacy FastAPI app,
# preserving existing REST routes and the OAuth/Drive writer.
legacy_app = app
from family_post_bridge.mcp_runtime_candidate import create_app as _create_mcp_app
app = _create_mcp_app()
