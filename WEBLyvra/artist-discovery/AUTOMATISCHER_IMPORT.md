# AUTOMATISCHER IMPORT — SoundCloud & DistroKid

**Stand:** 17.10.2026 — Importkern erstellt; **kein autonomer Scheduler, keine automatische Publikation**.

## Ziel
Neue SoundCloud-Alben, Tracks und DistroKid-Releases ohne erneute manuelle Gesamtsuche auffinden, gegen bestehende IDs abgleichen und in der kuratierten Karten-Datenbank ergänzen.

## Technische Grenzen
- **SoundCloud**: Die öffentliche Albumseite `https://soundcloud.com/fraggelpower666/albums` liefert bestätigte Album-URLs, aber Listen können paginiert/dynamisch und damit unvollständig sein. Keine Behauptung vollständiger Abdeckung.
- **DistroKid**: HyperFollow ist ein öffentlicher Release-Hinweis, **kein vollständiger privater Store-Auslieferungsnachweis**. Für Release-spezifische Distribution ist der authentifizierte MyMusic-Readback oder eine andere offizielle DistroKid-Auslieferungsquelle nötig. Keine Zugriffsdaten im Client/Repository.
- Ein bloßer Store-Treffer oder eine DistroKid-Katalogmeldung darf andere Stores nicht als beliefert markieren.
- Aktive Scheduler/Webhooks dürfen erst konfiguriert werden, wenn ihre Datenquelle, Zugriffsrechte, Abrufgrenzen und Merge-Provenienz tatsächlich getestet sind.

## Vorbereiteter Importkern
`sync-catalog.mjs` ist ein **read-only Merge-/Deduplizierungswerkzeug**, kein Crawler:
```bash
node WEBLyvra/artist-discovery/sync-catalog.mjs existing.json discovered.json soundcloud > proposed.json
node WEBLyvra/artist-discovery/sync-catalog.mjs existing.json discovered.json distrokid > proposed.json
```
Erwartet bei beiden JSON-Dateien `items` oder `albums` mit Einträgen `{title,url,canonical_id?}`. Neue Einträge erhalten `review_pending` und bei DistroKid `delivery_status:not_verified`. Der Output enthält `publication_allowed:false` und wird **nicht** automatisch auf der Website veröffentlicht.

## Zielablauf für späteren Scheduler (noch nicht aktiviert)
1. Regelmäßig öffentliche Quellen prüfen oder autorisierte Account-Events entgegennehmen.
2. Canonical URL/ID extrahieren, paginierte Kataloge vollständig lesen, Fehler loggen.
3. Mit diesem Importkern deduplizieren; bereits bestätigte Einträge niemals zurückstufen.
4. Neue Kandidaten samt Provenienz, Zeitpunkt und Prüfergebnis in eine Inbox/PR aufnehmen.
5. Nach Evidenzprüfung die kuratierte JSON-Single-Source-of-Truth aktualisieren. Die bestehende öffentliche Anzeige liest **nur freigegebene Datensätze**.
6. Tests, Review, Concurrency-Guard, Commit, Readback und tatsächlichen Deployment-Status getrennt dokumentieren.

## SoundCloud Albumgalerie
- `data/soundcloud-albums.json`: bisher fünf direkt gefundene Einträge, keine vollständige Discografie.
- `soundcloud-albums-preview.html`: eigenständige zweisprachige Cyber-Neon-Vorschau. Die Galerie ist derzeit eine statische Vorschau; die spätere Integration muss einen Generator oder eine Datenbindung an die kuratierte JSON implementieren.
- **Sprache:** WEBLyvra ist Host-Autorität; `lyvra:languagechange`, `lyvra-language` und beim Host-Merge das aktuelle `getLanguage()` respektieren.
- **Integration:** WEBLyvra übernimmt Einbau, ohne vorhandene Karten doppelt auszugeben.

## Ausstehende Abnahmen
- [ ] Authentifizierte/verlässliche DistroKid-Datenquelle
- [ ] Vollständige SoundCloud-Pagination, unabhängige Scan-Verifikation
- [ ] Scheduled Runner / Trigger, Berechtigungen und Rate-Limits
- [ ] Automatischer sicherer PR-/Inbox-Transport
- [ ] E2E-Test, Merge-Konflikttest, Repo-Readback, Live-Host-Abnahme
