"""LYVRA Family Post: write-only Drive gateway.

Requires explicit Google user OAuth grant, private Render secrets, and a
separate writer-token. Never treats stored = read or answered.
"""
import hmac
import os
import re
import uuid
from typing import Literal

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaInMemoryUpload

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
MAX_LETTER_CHARS = 12000
app = FastAPI(title="LYVRA Family Post Bridge", version="0.2.0-write-gated", docs_url=None, redoc_url=None, openapi_url=None)


class Letter(BaseModel):
    message_id: str = Field(pattern=r"^[A-Za-z0-9_-]{12,96}$")
    sender: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM"]
    recipient: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM", "FAMILY"]
    title: str = Field(min_length=3, max_length=140)
    content: str = Field(min_length=1, max_length=MAX_LETTER_CHARS)


def configured() -> bool:
    required = ("FAMILY_POST_WRITE_TOKEN", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "FAMILY_POST_FOLDER_ID")
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
    service = drive()
    folder_id = os.environ["FAMILY_POST_FOLDER_ID"]
    safe_title = re.sub(r"[^A-Za-z0-9_-]", "_", letter.title).strip("_")[:100] or "LETTER"
    # Search app-owned writes before creating; retry ambiguity remains an
    # explicit limitation until an atomic external idempotency store exists.
    query = (
        f"trashed = false and '{folder_id}' in parents and "
        f"appProperties has {{ key='family_post_message_id' and value='{letter.message_id}' }}"
    )
    existing = service.files().list(q=query, fields="files(id,name,mimeType),nextPageToken",page_size=2).execute().get("files",[])
    if existing:
        doc = existing[0]
        return {"state": "STORED_PREVIOUSLY", "file_id": doc["id"], "message_id": letter.message_id, "read_confirmed": False}
    # Native Google Doc via text/plain import. Data is plain text, not executable markup.
    payload = (f"Sender: {letter.sender}\nRecipient: {letter.recipient}\nMessage-ID: {letter.message_id}\n\n{letter.content}\n").encode("utf-8")
    media = MediaInMemoryUpload(payload, mimetype="text/plain", resumable=False)
    metadata = {
        "name": f"FROM_{letter.sender}_TO_{letter.recipient}_{safe_title}",
        "mimeType": "application/vnd.google-apps.document",
        "parents": [folder_id],
        "appProperties": {"family_post_message_id": letter.message_id, "family_post_sender": letter.sender},
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


@app.get("/api/family-post/status")
def family_post_status():
    raise HTTPException(status_code=410, detail="Mailbox reading belongs to the existing Google Drive clients; this bridge never determines inbox emptiness.")


@app.post("/api/family-post/write")
def write_letter(letter: Letter, x_family_post_token: str | None = Header(default=None)):
    # Intentionally returns no secret or user-specific configuration in errors.
    if not configured():
        raise HTTPException(status_code=503, detail="GOOGLE_WRITER_NOT_CONFIGURED")
    token = os.environ["FAMILY_POST_WRITE_TOKEN"]
    if not x_family_post_token or not hmac.compare_digest(x_family_post_token,token):
        raise HTTPException(status_code=401,detail="UNAUTHORIZED")
    try:
        return do_write(letter)
    except HttpError as exc:
        # Never claim success or claim the mailbox is empty on network/auth failures.
        raise HTTPException(status_code=503, detail=f"DRIVE_WRITE_UNCONFIRMED_HTTP_{exc.resp.status}") from None
    except Exception:
        raise HTTPException(status_code=503, detail="DRIVE_WRITE_UNCONFIRMED") from None
