# WEBLyvra — Website, Live-Quelle und Freeze

## Aktueller WEBLyvra-Betriebsstand · überprüft am 22.10.2026

**Produktiver Stand ist nicht identisch mit dem historischen Release-Freeze vom 01.10.2026.** Der Freeze `v1.1.0` bleibt als unveränderte Recovery-/Provenienzquelle erhalten; der aktuelle Live-Zustand folgt den neueren gültigen Deployments und der öffentlichen HTTP-Auslieferung.

- **Artist Discovery live:** https://weblyvra.666soundsdesign-broadcaster.com/artist-discovery/ — zuletzt unabhängig gelesen mit **450 Suno-Song-UUIDs**, **45 SoundCloud-Alben/Sets**, **122 SoundCloud-Tracks/Mixen**, also **617 einzigartigen Links**.
- **Google Resonance:** Öffentliche Such-/Produkt-Links und Belegstufen, keine vorgetäuschte Google-Search-Console-Telemetrie.
- **Produktionsbuild:** Cloudflare Pages `weblyvra-live`, Quellwurzel `WEBLyvra/live`; statisches Artefakt `dist`. `node tests/stage-artist-discovery.cjs` erstellt die Kopie der Add-on-Quelle vor den statischen Prüfungen. Aktuelle Arbeitsanleitung: `artist-discovery/README.md`.
- **Live-Readback:** Der Abruf vom 22.10.2026 enthält die neue Suno-UUID `b9fa99ea-7802-4f16-9a84-2f5142d4a4c9`, den 450er-Katalog und den 617er-Gesamtbestand. Die bereits bestätigten GitHub-/Cloudflare-Ergebnisse sind unabhängige, zeitgebundene Belege, keine permanente Freigabe künftiger Deployments.
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
