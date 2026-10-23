"""Owner-only Google OAuth bootstrap. No tokens in logs, URLs, or repository."""
import base64
import hashlib
import hmac
import os
import secrets
import time
from urllib.parse import urlencode

import requests
from fastapi import APIRouter, Cookie, Header, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse

router = APIRouter()
SCOPE = "https://www.googleapis.com/auth/drive.file"
CALLBACK = "https://lyvra-family-post-bridge.onrender.com/auth/google/callback"
STATE_TTL = 600


def _env_ready():
    names = ("FAMILY_POST_ADMIN_TOKEN", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET")
    return all(os.environ.get(name) for name in names)


def _sign(timestamp, nonce):
    message = f"{timestamp}.{nonce}".encode()
    return hmac.new(os.environ["FAMILY_POST_ADMIN_TOKEN"].encode(), message, hashlib.sha256).hexdigest()


def _authorize(authorization):
    if not _env_ready():
        raise HTTPException(503, "OAUTH_SETUP_NOT_CONFIGURED")
    expected = "Basic " + base64.b64encode(
        ("owner:" + os.environ["FAMILY_POST_ADMIN_TOKEN"]).encode()
    ).decode()
    if not authorization or not hmac.compare_digest(authorization, expected):
        raise HTTPException(
            status_code=401, detail="OWNER_AUTH_REQUIRED",
            headers={"WWW-Authenticate": 'Basic realm="LYVRA Family Post Setup"'},
        )


@router.get("/auth/google/start")
def google_start(authorization: str | None = Header(default=None)):
    _authorize(authorization)
    timestamp = str(int(time.time()))
    nonce = secrets.token_urlsafe(24)
    state = f"{timestamp}.{nonce}.{_sign(timestamp, nonce)}"
    params = {
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "redirect_uri": CALLBACK,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    result = RedirectResponse("https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params), status_code=302)
    result.set_cookie(
        "lyvra_oauth_state", state, max_age=STATE_TTL, secure=True,
        httponly=True, samesite="lax", path="/auth/google",
    )
    result.headers["Cache-Control"] = "no-store"
    return result


@router.get("/auth/google/callback", response_class=HTMLResponse)
def google_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    lyvra_oauth_state: str | None = Cookie(default=None),
):
    if not _env_ready() or error or not code or not state or not lyvra_oauth_state:
        raise HTTPException(400, "OAUTH_CALLBACK_INVALID")
    if not hmac.compare_digest(state, lyvra_oauth_state):
        raise HTTPException(400, "OAUTH_STATE_MISMATCH")
    parts = state.split(".")
    if len(parts) != 3 or not parts[0].isdigit():
        raise HTTPException(400, "OAUTH_STATE_INVALID")
    stamp, nonce, signature = parts
    if abs(time.time() - int(stamp)) > STATE_TTL:
        raise HTTPException(400, "OAUTH_STATE_EXPIRED")
    if not hmac.compare_digest(signature, _sign(stamp, nonce)):
        raise HTTPException(400, "OAUTH_SIGNATURE_INVALID")

    try:
        response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": os.environ["GOOGLE_CLIENT_ID"],
                "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": CALLBACK,
            },
            timeout=15,
        )
        response.raise_for_status()
        token = response.json().get("refresh_token")
    except (requests.RequestException, ValueError):
        raise HTTPException(502, "OAUTH_TOKEN_EXCHANGE_FAILED") from None
    if not token:
        raise HTTPException(409, "REFRESH_TOKEN_NOT_RETURNED_RECONSENT_REQUIRED")

    # Operator transfers this token into Render's secret env field.
    # No persistent storage, logs, URLs or third-party browser resources.
    from html import escape
    html = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        "<meta name='referrer' content='no-referrer'>"
        "<title>LYVRA Google OAuth</title></head><body>"
        "<h1>Google authorization completed</h1>"
        "<p>Store this refresh token ONLY in Render environment as GOOGLE_REFRESH_TOKEN."
        " Never paste it into chat or GitHub. Close this page after saving it.</p>"
        "<textarea readonly rows='5' cols='80'>" + escape(token) + "</textarea>"
        "</body></html>"
    )
    result = HTMLResponse(html, headers={
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
    })
    result.delete_cookie("lyvra_oauth_state",path="/auth/google",secure=True,httponly=True,samesite="lax")
    return result
