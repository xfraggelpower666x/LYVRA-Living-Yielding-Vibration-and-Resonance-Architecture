# LYVRA MCP WORKFLOW R03 – isolierter Entwicklungskandidat
Vollständiger R02-Baum unverändert in R02/; R01 darin enthalten. R03 ergänzt Gateway, GitHub Contents REST-Verifier, atomare Tageskontingente und Mobile-UI. Keine Live-Konfiguration.

## Regression
Node.js 22: `node --test R02/R01/test/*.test.mjs R02/test/*.test.mjs test/*.test.mjs`.
66/66 lokale Tests bestanden. Testantworten/Transaktionen sind Fixtures; kein Cloudflare-Host- oder unabhängiger Live-Provider-Receipt. R02/SHA256SUMS.txt prüft die 23 Originaldateien, die Prüfliste selbst ist die 24. Datei.

## Konfiguration (nur nach separater Freigabe)
- GATEWAY_TOKEN: Einzelbetreiber, mindestens 32 Zeichen, sicher zufällig, niemals in Source, URL oder Logs.
- WEB_ORIGIN: exakt autorisierte HTTPS-Origin von WEBLyvra. CLI ohne Origin benötigt ebenfalls Token.
- STATE: SQLite-backed Durable Object Binding; Kandidatenkonfiguration enthält keine Route und deaktiviert workers.dev/preview URLs. Kein Deploy ausgeführt.
- MCP_ENDPOINT, MCP_ALLOWED_ORIGIN, MCP_TOKEN, MCP_PROVIDER_ID, MCP_TOOL: separat autorisierte HTTPS-MCP-Verbindung; kein beliebiger Benutzer-Endpunkt. R02 unterstützt nur die dokumentierte begrenzte Transport- und Toolform.
- GITHUB_READ_TOKEN: separate, auf genau das native Repository begrenzte Read-only-Berechtigung; bei öffentlichen Quellen ggf. ohne Token. Nicht aus Familienpost/Radio übernehmen.
- COST_EVIDENCE: Betreibergebundener JSON-Nachweis mit scope=LYVRA_MCP_WORKFLOW_READ_ONLY, zeroAdditionalCost=true, providerQuotaVerified=true, cloudflareFreeVerified=true, evidenceRef, issuedAt/expiresAt (Epoch ms, max. 24h), dailyJobs (1–100). Keine automatische Billing-Verifikation. Ohne tatsächlich bestätigten Tarif, verbleibende Quoten und Providerkosten NICHT setzen. Lokale Tagesgrenze allein garantiert keine Kostenfreiheit und umfasst nicht sämtliche Account-Requests.

## Grenzen
REST-Verifier prüft SHA und UTF-8-Bytes, nicht unabhängige Organisationsidentität. Beide Kanäle lesen dieselbe GitHub-Quelle; gleiche Inhalte sind keine zweite unabhängige Authority. Live-Provider-Authentifizierung, echte DO-Persistenz, Quoten, CSP und Browser-/iOS-Abnahme fehlen. Kein OAuth-Flow, keine kostenpflichtigen APIs, keine Suno-Generierung. Keine Kopplung von Familienpost-/Radio-Secrets. In-flight-Jobs bleiben zur manuellen Prüfung erhalten; keine automatische Wiederholung. Kein automatisches Löschen der Historie. Vor Live-Betrieb sind Retention, Quoten-/Missbrauchsschutz und Tokenrotation abzunehmen.

## WEBLyvra
web/ ist getrennte UI; config.mjs bleibt leer und deaktiviert alle Sends. Erst nach bestätigtem Gateway dessen exakte HTTPS-Origin konfigurieren. Kein vorhandenes WEBLyvra-Dist verändern. Kein Secret im Browser-Speicher oder Repository; nur Eingabefeld/Arbeitsspeicher. Unklare Ausgänge werden per Job-Status abgefragt.

## Publikation
Kein GitHub-Write in diesem Durchlauf. Vollständigen Quellbaum unter isoliertem Kandidatenpfad veröffentlichen, erst nach bestätigtem Deployment-Skip und Kosten-Gate. R02/PUBLICATION_PLAN.md erhalten. Kandidatenbranch mit [CI Skip] direkt aus dem vollständig erzeugten Commit anlegen; keine PR/kein Merge/keine Current-Promotion. SHA-Readback aller Dateien und unveränderter produktiver HEAD erforderlich. Der lokale Container hat keine DNS-Auflösung für GitHub; Connector akzeptiert Inhalte, aber keinen lokalen Verzeichnispfad. Der Publisher ist ein separater, nicht ausgeführter manueller Transferweg.

## R03.1 – Cost Governance Repair
Lokale Entwicklung und Offline-Tests benötigen keinen Provider-Billing-Nachweis. Der Publisher verlangt nur die Bestätigung, dass die konkrete Quellcodepublikation keine kostenrelevanten Nebenwirkungen (CI/Preview/Deploy) auslöst; der alte Schalter bleibt kompatibel. Remote-Ausführung akzeptiert alternativ einen vertrauenswürdig betreiberkonfigurierten, zeitlich begrenzten aktionsbezogenen COST_EVIDENCE-Nachweis (evidenceVersion=2, operation=REMOTE_READBACK, operationBound=true, entitlementVerified=true, noAdditionalCharge=true; übrige Scope/TTL/Limit-Felder bleiben Pflicht). Dies ist keine automatische Tarifprüfung. Keine bezahlte Ausführung, kein Deployment. Siehe governance/INTELLIGENT_COST_GOVERNANCE.md. Original-R03 bleibt als separates unverändertes ZIP erhalten.
