# WEBLyvra — Website, Live-Quelle und Freeze

Aktueller Freeze: v1.1.0, 01.10.2026. Präsentationsdateien aus veröffentlichter Sites-Version 15 (`498c4b1bc41e53dde3d81d085ca1763e974ba353`). Eine LYVRA-Identität; keine native Authority ersetzt.

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

Live-Adresse: https://weblyvra.666soundsdesign-broadcaster.com/ . Cloudflare Pages: DEPLOYMENT_VERIFIED für Commit `b163872347380b5e0795ea0b8fca1908571005ac`, Projekt `weblyvra-live`. Website und Datenschutzseite wurden am 01.10.2026 durch den Betreiber als erreichbar bestätigt (USER_BROWSER_CONFIRMED). Der unabhängige HTTP-Readback dieser Umgebung bleibt wegen HTTP 403 offen. Details: `deployment/PRODUCTION_STATUS_2026-10-01.json`.

Alle drei automatisierten Prüfgruppen PASS. Erreichbarkeit von Website und Datenschutzseite: Betreiberbestätigung vorhanden. Vollständige Desktop-/Mobil-Interaktionen, realer Ton, Screenreader, unabhängige HTTPS-/Zertifikats- und Assetprüfung sowie vollständige rechtliche Prüfung bleiben offen. Webradio, Google Fonts und GPT-Verknüpfung bleiben externe Dienste. Chat ist eine gekennzeichnete lokale Demo, keine Chat-API.

Repository-Safepoint: `lyvra-backup-pre-weblyvra-v1-1-20261001`. Änderungen erst kontrolliert in live, anschließend neuer Freeze. Historische Releases nicht überschreiben. Keine privaten Vaults, Secrets oder neuen Admin-/Backend-Funktionen.
