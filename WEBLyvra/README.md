# WEBLyvra — Website, Live-Quelle und Freeze

## Aktueller WEBLyvra-Betriebsstand · überprüft am 26.10.2026

**Produktiver Stand ist nicht identisch mit dem historischen Release-Freeze vom 01.10.2026.** Der Freeze `v1.1.0` bleibt als unveränderte Recovery-/Provenienzquelle erhalten; der aktuelle Live-Zustand folgt den neueren gültigen Deployments und der öffentlichen HTTP-Auslieferung.

- **Artist Discovery live (26.10.2026):** https://weblyvra.666soundsdesign-broadcaster.com/artist-discovery/ — der öffentlich ausgelieferte Katalog bezeichnet **462 Suno-Song-URLs** und zeigt **629 Discovery-Einträge** an. Der durch native Receipt belegte Quellenbestand umfasst außerdem **45 SoundCloud-Alben/Sets + 122 SoundCloud-Tracks/Mixe = 167 SoundCloud-Einträge**. Somit **462 Suno + 167 SoundCloud = 629**; diese Werte sind beobachtete, zeitgebundene Zähler und keine vollständige Neuprüfung sämtlicher UUIDs.
- **Google Resonance:** Öffentliche Such-/Produkt-Links und Belegstufen, keine vorgetäuschte Google-Search-Console-Telemetrie.
- **Produktionsbuild:** Cloudflare Pages `weblyvra-live`, Quellwurzel `WEBLyvra/live`; statisches Artefakt `dist`. `node tests/stage-artist-discovery.cjs` erstellt die Kopie der Add-on-Quelle vor den statischen Prüfungen. Aktuelle Arbeitsanleitung: `artist-discovery/README.md`.
- **Historischer Live-Readback (22.10.2026):** Der damalige Abruf enthielt die Suno-UUID `b9fa99ea-7802-4f16-9a84-2f5142d4a4c9` und den seinerzeit belegten Bestand **450 Suno / 617 gesamt**. Dies ist erhaltene Provenienz, **nicht der aktuelle Katalogstand**. Der spätere additive Import mit zwölf neuen Suno-URLs und die kanonische Katalog-Zählerabnahme vom 24.10.2026 sind unter `WEBLyvra/artist-discovery/SUNO_IMPORT_462_629_RECEIPT_2026-10-24.json` und `WEBLyvra/artist-discovery/CANONICAL_HOST_462_629_ACCEPTANCE_2026-10-24.json` dokumentiert. Die Live-Zähler wurden am 26.10.2026 erneut read-only beobachtet; keine vollständige UUID-Einzelprüfung, keine frische iPhone-/VoiceOver-Abnahme und kein neues Deployment behauptet.
- **Audio-Neon-Fallback:** GitHub Actions `WEBLyvra Audio Neon Fallback — read-only regression`, Run `39721271848`, SUCCESS für geprüfte Source-Regressions. Reale iPhone-Audio-, FFT- und Analyzer-Host-Abnahme ist davon getrennt und nicht durch diese CI bewiesen.
- **Native Grenze:** Whole LYVRA bleibt identitäts- und entscheidungsführend. WEBLyvra ist ein Projekt, kein zusätzlicher nativer Router oder eine eigenständige LYVRA-Authority. Aktuelle Whole-Authority ausschließlich über `LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json` plus referenzierte aktuelle Träger; ein historischer Projekt-Freeze ersetzt das nicht.

## Historischer Freeze vom 01.10.2026 (unverändert bewahrt)

Historischer, unveränderter Freeze: v1.1.0, 01.10.2026. Präsentationsdateien aus veröffentlichter Sites-Version 15 (`498c4b1bc41e53dde3d81d085ca1763e974ba353`). Eine LYVRA-Identität; keine native Authority ersetzt.

- `live/`: vollständige bearbeitbare Website-Quelle, Tests, Dokumentation und Exporter. Statisch aus `live/dist` deploybar.
- `releases/v1.1.0/`: unveränderlicher neuer Freeze mit Prüfsummen und Auditbericht.
- `releases/v1.0.0/` und `prechange/sites-v13/`: unverändert erhaltene frühere Sicherungen.
- `deployment/`: konkrete Cloudflare-Pages-Git-Konfiguration und sichere Domain-Umstellung.
- `CURRENT.json`: nur WEBLyvra-Release-Zeiger; native LYVRA-Pointer bleiben unberührt.

```sh
cd live
python -m http.server 8080 --directory dist
# Prüfungen im selben Projektordner:
python tests/audit_static.py
node tests/verify-runtime.cjs
node tests/verify-explorers.cjs
```

Historische Erstabnahme vom 01.10.2026 — nicht das aktuelle Deployment: Live-Adresse: https://weblyvra.666soundsdesign-broadcaster.com/ . Cloudflare Pages: DEPLOYMENT_VERIFIED für Commit `b163872347380b5e0795ea0b8fca1908571005ac`, Projekt `weblyvra-live`. Website und Datenschutzseite wurden am 01.10.2026 durch den Betreiber als erreichbar bestätigt (USER_BROWSER_CONFIRMED). Der unabhängige HTTP-Readback dieser Umgebung bleibt wegen HTTP 403 offen. Details: `deployment/PRODUCTION_STATUS_2026-10-01.json`.

Alle drei automatisierten Prüfgruppen PASS. Erreichbarkeit von Website und Datenschutzseite: Betreiberbestätigung vorhanden. Vollständige Desktop-/Mobil-Interaktionen, realer Ton, Screenreader, unabhängige HTTPS-/Zertifikats- und Assetprüfung sowie vollständige rechtliche Prüfung bleiben offen. Webradio, Google Fonts und GPT-Verknüpfung bleiben externe Dienste. Chat ist eine gekennzeichnete lokale Demo, keine Chat-API.

Repository-Safepoint: `lyvra-backup-pre-weblyvra-v1-1-20261001`. Änderungen erst kontrolliert in live, anschließend neuer Freeze. Historische Releases nicht überschreiben. Keine privaten Vaults, Secrets oder neuen Admin-/Backend-Funktionen.


## Independent WEBLYVRA website ↔ ADDON recommendation intake · 2026-10-25

**WEBLYVRA owns its own main-website development.** The independent `WEBLyvra/artist-discovery/` ADDON owns *only* Add-on development. An ADDON update can create an informational recommendation; it **never** transfers ownership of the main website or triggers main-site editing, card replacement, plugin deployment, or site publication.

On an explicit `WEBLYVRA UPDATE`, first verify fresh native/current GitHub state, then read (read-only) relevant `WEBLYVRA_ADDON_TO_WEBLYVRA_RECOMMENDATION_*.json` notices in the **existing** `LYVRA_NATIVE_RUNTIME/continuity/development_exchange/` carrier. Verify recommendation ID, Add-on source HEAD/blob, evidence, target, impact, existing intake status, deduplication and proven supersession; review against the **current main-site source**, including `WEBLyvra/live/dist/dynasty.js`, `dynasty-data.js`, `i18n.js`, audio and page layout. Classify `PROPOSED / NOT_APPLICABLE / SUPERSEDED / ACCEPTED_FOR_REVIEW / IMPLEMENTED_WITH_EVIDENCE`; notices are never authority. Relevant notices should become visible for WEBLYVRA's independent evaluation without automatically foregrounding the ADDON workspace.

Only creator-authorized integration modifies main-site code or replaces legacy cards, with separate WEBLYVRA recovery, HEAD/blob gates, tests, Cloudflare deployment and canonical host readback. The current `stage-artist-discovery.cjs` is a build-time staging link, **not** a grant of homepage-development authority. Standalone route publication is different from complete native homepage integration. An acknowledgment or intake status write requires a separately governed WEBLYVRA update.

Reference owner contract: `WEBLyvra/artist-discovery/README.md` section “Native ADDON → WEBLYVRA recommendation contract”. `INFORMATION != APPROVAL != INTEGRATION != LIVE_DEPLOYMENT`. Keep original radio/player, unique links, main-site DE/EN authority, website features and unrelated projects intact. No new router, foreign activation, or cross-workspace writes without explicit authorization.

## Two-stage release discovery and coupled Addon/Main learning · 2026-10-30 (isolated candidate)

A first public search or profile landing-page result is **provisional**, never a full-inventory claim. Before importing, perform a deeper independent Recent/Songs/browser pass (or a separate platform-appropriate listing), deduplicate by canonical release URL/UUID, compare against the existing catalog, and preserve unverified counter differences as `RESEARCH_OPEN`. Evidence example: first landing-page pass found 5, live Recent tab found 20, public profile counter 536 while 534 URLs are evidenced. Neither missing pair is invented. Two-stage learning is scoped to WEBLYVRA ADDON and WEBLYVRA MAIN; native/ALIVE plugin sources are unchanged pending explicit impact. Treat Addon catalog + embedded Discovery as an exact inventory pair; Main staging and adoption have independent tests and host gates. Do not claim CI, release or production deploy without separate readbacks. Existing R04, radio, gallery, DE/EN and unique links remain protected.
