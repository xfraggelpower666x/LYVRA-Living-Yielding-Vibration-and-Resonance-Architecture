"""Owner-gated Google Picker, folder-only and never a write operation.

Requires browser API key and Google Cloud project number. The Picker's Google
OAuth token is browser-only. Server checks the exact configured folder with
its own existing refresh token after user selection.
"""
import hashlib
import hmac
import html
import json
import os
import secrets
import time

from fastapi import APIRouter, Cookie, Header, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from family_post_bridge.oauth_setup import _authorize

router = APIRouter()
COOKIE = "lyvra_picker_session"
LIFETIME = 600


def _signed_session():
    timestamp = str(int(time.time()))
    nonce = secrets.token_urlsafe(20)
    base = f"{timestamp}.{nonce}"
    signature = hmac.new(os.environ["FAMILY_POST_ADMIN_TOKEN"].encode(), base.encode(), hashlib.sha256).hexdigest()
    return f"{base}.{signature}"


def _valid_session(value):
    if not value or not os.environ.get("FAMILY_POST_ADMIN_TOKEN"):
        return False
    parts = value.split(".")
    if len(parts) != 3 or not parts[0].isdigit():
        return False
    timestamp, nonce, signature = parts
    if abs(time.time() - int(timestamp)) > LIFETIME:
        return False
    expected = hmac.new(
        os.environ["FAMILY_POST_ADMIN_TOKEN"].encode(),
        f"{timestamp}.{nonce}".encode(),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(signature, expected)


def _picker_configured():
    return all(os.environ.get(k) for k in (
        "GOOGLE_CLIENT_ID", "GOOGLE_PICKER_API_KEY", "GOOGLE_PROJECT_NUMBER",
        "FAMILY_POST_ADMIN_TOKEN", "FAMILY_POST_FOLDER_ID",
    ))


@router.get("/auth/google/picker", response_class=HTMLResponse)
def picker_page(authorization: str | None = Header(default=None)):
    _authorize(authorization)
    if not _picker_configured():
        raise HTTPException(503, "PICKER_SETUP_NOT_CONFIGURED")
    config = {
        "clientId": os.environ["GOOGLE_CLIENT_ID"],
        "apiKey": os.environ["GOOGLE_PICKER_API_KEY"],
        "appId": os.environ["GOOGLE_PROJECT_NUMBER"],
        "expectedFolderId": os.environ["FAMILY_POST_FOLDER_ID"],
    }
    configuration = json.dumps(config).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
    page = """<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>LYVRA – Ordnerfreigabe</title>
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body><h1>LYVRA Familienordner freigeben</h1>
<p>Wähle ausschließlich den bereits bestehenden gemeinsamen Familienordner.
Diese Seite schreibt keine Briefe.</p>
<button id="pick" disabled>Familienordner in Google Drive auswählen</button>
<pre id="result" role="status">Google-Dienste werden geladen …</pre>
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://accounts.google.com/gsi/client"></script>
<script>
"use strict";
const config = __CONFIG__;
let pickerReady = false;
let tokenClient = null;
const output = document.getElementById("result");
function report(message) { output.textContent = message; }
function init() {
  if (!window.gapi || !window.google || !google.accounts) {
    report("Google Scripts konnten nicht geladen werden."); return;
  }
  google.accounts.oauth2;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: config.clientId,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: (reply) => {
      if (!reply || !reply.access_token || reply.error) {
        report("Google-Autorisierung nicht erfolgreich."); return;
      }
      const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
      view.setSelectFolderEnabled(true);
      const picker = new google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(reply.access_token)
        .setDeveloperKey(config.apiKey)
        .setAppId(config.appId)
        .setCallback(onPick)
        .build();
      picker.setVisible(true);
    },
  });
  gapi.load("picker", {callback: () => {
    pickerReady = true;
    document.getElementById("pick").disabled = false;
    report("Bereit. Klicke auf den Button und wähle deinen bestehenden Familienordner.");
  }});
}
async function onPick(data) {
  if (data.action !== google.picker.Action.PICKED) return;
  const folder = data.docs && data.docs[0];
  if (!folder || folder.id !== config.expectedFolderId) {
    report("Anderer Ordner gewählt. Keine Änderung. Bitte den bestehenden Familienordner auswählen.");
    return;
  }
  report("Ordner gewählt. Google-Berechtigung wird geprüft …");
  try {
    const response = await fetch("/api/family-post/picker-verify", {
      method:"POST", credentials:"same-origin",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({folder_id:folder.id}),
    });
    const data = await response.json();
    report(JSON.stringify(data, null, 2));
  } catch (_) { report("Berechtigungsprüfung fehlgeschlagen, nichts geschrieben."); }
}
document.getElementById("pick").addEventListener("click", () => {
  if (!pickerReady || !tokenClient) return;
  tokenClient.requestAccessToken({prompt:"consent"});
});
window.addEventListener("load", init);
</script></body></html>""".replace("__CONFIG__", configuration)
    response = HTMLResponse(page, headers={
        "Cache-Control": "no-store",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; script-src 'self' https://apis.google.com https://accounts.google.com https://*.google.com https://*.googleapis.com https://*.gstatic.com 'unsafe-inline'; connect-src 'self' https://accounts.google.com https://*.googleapis.com https://*.google.com; frame-src https://*.google.com https://*.googleusercontent.com; style-src 'self' 'unsafe-inline'; img-src https://*.google.com https://*.gstatic.com data:; base-uri 'none'; frame-ancestors 'none'",
    })
    response.set_cookie(COOKIE, _signed_session(), httponly=True, secure=True, samesite="lax", max_age=LIFETIME, path="/api/family-post")
    return response


class Selection(BaseModel):
    folder_id: str


@router.post("/api/family-post/picker-verify")
def picker_verify(payload: Selection, lyvra_picker_session: str | None = Cookie(default=None)):
    if not _valid_session(lyvra_picker_session):
        raise HTTPException(401, "OWNER_SESSION_REQUIRED")
    if not hmac.compare_digest(payload.folder_id, os.environ["FAMILY_POST_FOLDER_ID"]):
        raise HTTPException(400, "WRONG_FOLDER")
    from family_post_bridge.server import drive
    try:
        metadata = drive().files().get(
            fileId=payload.folder_id, fields="mimeType,capabilities(canAddChildren)",
            supportsAllDrives=True,
        ).execute()
    except Exception:
        return {"result":"NOT_VERIFIED", "folder_selected":True, "letter_written":False}
    can_add = metadata.get("capabilities",{}).get("canAddChildren") is True
    valid = metadata.get("mimeType") == "application/vnd.google-apps.folder" and can_add
    return {
        "result": "FOLDER_VISIBLE_CAN_ADD" if valid else "NOT_VERIFIED",
        "folder_selected": True, "can_add_children": can_add,
        "letter_written": False, "actual_write_verified": False,
    }
