# WEBLYVRA — additive Dynasty-Erweiterung

Quelle: Unified Master Handoff v3.0.0, 01.10.2026.

## Ausgangssicherung — VERIFIZIERT

Ausgangscommit: `2bde150719b93d2d45b5926dad7ed0222ba39d2b` (veröffentlichte Version 4).
Wiederherstellbares Archiv: `backups/WEBLYVRA_PRECHANGE_v4_20261001.tar.gz`.
Die vier bestehenden Quelldateien wurden direkt aus dem Archiv mit dem Ausgangsstand verglichen.

## Umsetzung — VERIFIZIERT im Quell- und Renderingtest

- Vier isolierte Zusatzbereiche in den bestehenden Abschnitten Identity, Creative Lab, Sound & Creation und Webradio.
- Fraggle/Dad, Veluna/Mum und LYVRA/Daughter mit Charaktergeschichten, DNA und Symbolik.
- Familienfarben, eigenständige Identitäten, vier ergänzende Facetten-Erklärungen.
- Sechs kreative Fähigkeiten, musikalische Herkunft und Genres.
- 17 eindeutige externe Linkziele, kategorisiert; Twitch nutzt ein gemeinsames Datenobjekt in zwei Kategorien.
- Keine sichtbaren Roh-URLs auf Linkkarten; ausschließlich bereitgestellte Ziele.
- Spotify-Künstler und Nutzerprofil sowie Twitch-Kanal und Radioseite getrennt. Discord ist ein Benutzerprofil, keine Einladung.
- Kontakt aus bereitgestellten Angaben. Keine vollständigen Impressumsangaben erfunden.
- Alle neuen Beschreibungen und Bedienelemente zweisprachig im vorhandenen Sprachzustand.
- Keine Änderung an DNS, Streams, Authentifizierung, Player oder bestehenden Facettentexten.
- Keine fremde Systemaktivierung oder Mutation nativer LYVRA-Authority.

## Erhaltung — VERIFIZIERT

Bestehendes HTML wird nur um eine CSS-Einbindung erweitert. Alle vorhandenen Bereiche und Texte bleiben erhalten.
Bestehende app.js erhält ausschließlich Import und Initialisierung der Erweiterung.
Bestehende i18n.js und styles.css bleiben bytegenau unverändert.
Bestehende Bilder, Orbit, vier Facetten, Animationen, Sprachwahl und ein einzelner 365px-Player bleiben erhalten.
Kein zusätzlicher Player oder Audio-Autostart.
Neue CSS-Regeln sind unter `.dyn-extension` isoliert; responsive Raster und reduzierte Bewegung sind enthalten.

## Tests

- JavaScript-Syntax: VERIFIZIERT.
- Erhaltungsvergleich der bestehenden Quellen: VERIFIZIERT.
- DE/EN-Ausgabe aller vier Zusatzbereiche: VERIFIZIERT im isolierten Renderingtest.
- Sprachunabhängige Linkziele, 17 eindeutige Ziele und Handoff-Abgleich: VERIFIZIERT.
- Sicherungsarchiv-Readback: VERIFIZIERT.
- Die neuen Bereiche erzeugen keine iframes: VERIFIZIERT.
- Browserbedienung, tatsächliche Audio-Wiedergabe und visuelle Desktop-/Tablet-/Smartphone-QA: OFFEN. Für diesen statischen Sites-Checkout ist kein unterstützter Browser-Preview verfügbar.
- Externe Erreichbarkeit: OFFEN. Abrufversuche für WEBLYVRA, Webradio, Twitch und Spotify wurden vom Web-Abrufwerkzeug nicht unterstützt oder blockiert. Das belegt keinen Ausfall der Zielseiten.
- Veröffentlichung wird separat durch terminalen Sites-Deploymentstatus bestätigt. Vollständiger HTTP-Live-Readback und komplette Browserabnahme dürfen daraus nicht abgeleitet werden.

## Wiederherstellung

Die Ausgangsversion 4 bleibt als gespeicherte Sites-Version erhalten. Für eine vollständige Rückkehr zum Ausgangsstand können dieser gespeicherte Stand oder das geprüfte Quellarchiv genutzt werden; dabei vorher aktuelle Änderungen sichern.
