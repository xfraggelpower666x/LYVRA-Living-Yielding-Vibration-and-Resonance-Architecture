# LYVRA MCP WORKFLOW R02 – isolierter Quellcodekandidat
Node.js 22, keine npm-Abhängigkeiten. Test: `node --test R01/test/*.test.mjs test/*.test.mjs`. 34 lokale Tests (13 R01 + 21 R02). HTTP-Transport und Durable-Storage-Adapter wurden gegen injizierte lokale Fixtures getestet, nicht gegen einen Live-Provider oder Cloudflare Durable Objects. Zwei konfigurierte Readback-Kanäle sind keine unabhängige Identitätsbeglaubigung.

## Aufbau
R01/ unveränderte Originalrevision; original/ bytegenau geprüfte SuperCodeForge-Importe; runtime/ Transport, Workflow und Worker-Einstieg; test/ Regression. Die Worker-Bindungen müssen separat autorisiert eingerichtet werden. Ohne Bindungen keine Ausführung. Keine Cloudflare-Deployment-Konfiguration enthalten, um unbeabsichtigtes Deployment zu vermeiden.

## Spätere Bindungen (noch nicht vorhanden)
STATE: Durable Object Namespace für WorkflowState. AUTHORIZER: eigener autorisierter Service, POST /check, Status 204 ausschließlich bei gültiger Berechtigung. VERIFIER: separater autorisierter Readback-Service, POST /read, liefert sha und UTF-8 content. MCP_ENDPOINT, MCP_TOKEN (Secret), MCP_TOOL, PROVIDER_ID, VERIFIER_ID, ZERO_COST_VERIFIED, COST_EVIDENCE_EXPIRES_AT (Millisekunden). Keine dieser Beispielbindungen stellt einen bereits verfügbaren Dienst dar. Kein Token in Frontend oder Repo. Endpoint und Provider werden ausschließlich aus Betreiberkonfiguration übernommen. Ein separates, unabhängig belegtes Auth-/Verifier-Deployment ist noch offen. Die Kostenattestation muss aus belegten Kontingenten entstehen, nicht einfach auf true gesetzt werden.

WEBLyvra: später POST /readback über geschützte Oberfläche mit stabiler Job-ID; noch keine Live-Anbindung oder CORS-Konfiguration. Kein automatisches Replay bei Timeout. Kein Suno-Schreibzugriff.

## Publikation
Quellcode-only auf isoliertem Branch, kein PR/Merge/Pointer-Update. WEBLyvra Pages hat Preview-Builds für alle Branches; Commit-Präfix [CI Skip] ist laut Cloudflare-Doku nötig. Vor Veröffentlichung sämtliche aktuellen Deploy-Hooks/Branchregeln und Quota erneut prüfen. Direkter Repo-Readback erforderlich. Nicht automatisch deployen. Kein produktiver Pointer.
