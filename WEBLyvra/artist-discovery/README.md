# WEBLyvra / Artist Discovery Add-on

Status: STAGED / NOT INTEGRATED / NOT DEPLOYED (2026-10-16).

Eigenständiges, statisches LYVRA-kompatibles Add-on für FRAGGELPOWER666 und 666SOUNDsDESIGn. Keine Änderung an der produktiven WEBLyvra-Seite, kein Router und keine Backend-Abhängigkeit.

## Dateien
- `index.html`: eigenständige responsive Listen-&-Buy-/DJ-/Discovery-Galerie im LYVRA-Cyber-Neon-Stil; sichere externe Links, Filter und JSON-Readback.
- `data/platforms.json`: kuratierter Anzeige-Snapshot mit Herkunfts-/Prüfstatus und offenen Aufgaben. Kein Beweis vollständiger DistroKid-Auslieferung.

## Governance
1. Öffentliche Store-Galerie: bestätigtes Künstler-/Albumprofil ODER release-spezifisch belegte DistroKid-Auslieferung. Store-Support allein reicht nicht.
2. Independents (Mixcloud, SoundCloud, Suno) und Internet-Erwähnungen werden getrennt geführt.
3. Keine Treffer -> keine öffentliche Karte; Suchprotokoll bleibt intern.
4. Vor Status-Promotion: Künstlername, Quelle, Datum, konkrete URL und möglichst Store-Readback prüfen; keine pauschalen Behauptungen über alle Releases.
5. Die erweiterte Recherche-Masterdatei `FRAGGELPOWER666_666SOUNDsDESIGn_PLATFORM_MAP_2026-10-16_v5.json` existiert als separates Arbeitsartefakt, **ist hier noch nicht als vollständiger Master eingecheckt**. Die lokale Snapshot-Datei enthält nur die belegten Darstellungsziele.

## Integration (noch offen)
Nach WEBLyvra-Rehydration und Pre-Change-Backup bestehende `WEBLyvra/live/dist/index.html`-Kartenstruktur prüfen und Add-on genau einmal an geeigneter Stelle verlinken/einbetten. Keine doppelten Kartenbereiche. Pfade und Deploy-Artefakte im tatsächlichen Cloudflare-Build abgleichen. Desktop-/Mobile-Audit, Linktest und Fresh-Host-Readback vor LIVE/DEPLOYED-Claim.

## Lokaler Test
`python -m http.server 8080 --directory WEBLyvra/artist-discovery`
Danach `http://localhost:8080/` öffnen. Ein `file://`-Aufruf kann den JSON-Fetch blockieren.
