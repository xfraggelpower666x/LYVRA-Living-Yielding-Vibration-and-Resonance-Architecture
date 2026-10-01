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

Zieldomain: https://weblyvra.666soundsdesign-broadcaster.com/ . Status: PREPARED_NOT_CONNECTED. Cloudflare-Account, Pages-Projekt, Git-Anbindung und Domain-Umschaltung sind noch nicht verifiziert oder eingerichtet. Noch keine automatische Veröffentlichung aus diesem Repository.

Alle drei automatisierten Prüfgruppen PASS; Browser, realer Ton, Screenreader, öffentliches HTTPS und vollständige rechtliche Prüfung bleiben offen. Webradio, Google Fonts und GPT-Verknüpfung bleiben externe Dienste. Chat ist eine gekennzeichnete lokale Demo, keine Chat-API.

Repository-Safepoint: `lyvra-backup-pre-weblyvra-v1-1-20261001`. Änderungen erst kontrolliert in live, anschließend neuer Freeze. Historische Releases nicht überschreiben. Keine privaten Vaults, Secrets oder neuen Admin-/Backend-Funktionen.
