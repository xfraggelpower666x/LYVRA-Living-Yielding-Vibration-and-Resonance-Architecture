# LYVRA — Complete Source Export & Preservation

Dieses Paket enthält zwei klar getrennte Originalquellstände:

- `live-project/`: unveränderte Quellkopie der zuletzt erfolgreich veröffentlichten Sites-Version 5 (Commit 95f2b9d88d36cfc09ab58b7a00b2b4abfefc29b9). Kein Chat, keine Datenschutz-Unterseite, keine Add-ons 001–006 in diesem Live-Stand.
- `draft-project/`: vollständiger aktueller Entwurf einschließlich Datenschutz V7.1, lokaler Chat-Demo mit GPT-Button, zusätzlichem Miniplayer und Add-ons 001–006.
- `MANIFEST.json`: SHA-256-Werte aller Dateien, Quellcommits und Abgrenzung.

## Technik und Projektstruktur

Die vorhandene Website ist ein statisches HTML/CSS/JavaScript-Projekt mit ES-Modulen. Kein React, Vite, npm-Paketmanifest, Dependency-Lockfile oder Buildschritt vorhanden. Es werden keine fiktiven Originalkonfigurationen ergänzt. Die `.openai/hosting.json` wird unverändert mitgeliefert. Unabhängige statische Hoster benötigen sie nicht. Keine serverseitige Datenbank, kein OpenAI-API-Backend und keine Authentifizierung vorhanden.

`dist/index.html`: Startseite mit acht Hauptbereichen. `dist/styles.css`: ursprüngliches Design. `dist/app.js`: Navigation, Tabs, Wellenformen. `dist/i18n.js`: DE/EN, lokale Sprachpräferenz. `dist/dynasty*`: vorhandene additive Familien-/Plattforminfos. `dist/assets`: Markenbilder, Hintergrund, Header/Footer und Favicons. `dist/aurora.webp`: bestehendes World-Bild. Entwurf zusätzlich: `privacy/`, `chat-demo*`, `evolution-status.css`, `explorer-data.js`, `explorers.js`, `explorers.css`. `docs/` enthält Änderungs- und Prüfberichte; `tests/` enthält ausschließlich nicht öffentlich auszuliefernde Tests.

## Lokal starten

Python 3 installieren, ZIP entpacken, Terminal im Paketordner öffnen:

```
python -m http.server 8000 --bind 127.0.0.1 --directory live-project/dist
```

Dann http://127.0.0.1:8000/ öffnen. Für den Entwurf stattdessen `--directory draft-project/dist` verwenden. Entwurf-Datenschutz: http://127.0.0.1:8000/privacy/ . Server mit Strg+C beenden. Kein Build nötig. ES-Module über HTTP aufrufen; index.html nicht per file:// öffnen.

## Unabhängiges Deployment — nur Anleitung, nicht ausgeführt

Nach separater Freigabe ausschließlich den Inhalt des ausgewählten `dist`-Ordners als statische Website im Domain-Root bereitstellen. Keine Migration/DNS-Änderung durchgeführt. Der komplette Exportordner enthält Berichte und zwei Quellstände und ist KEIN direkt öffentlich hochzuladendes Webroot.

Interne Links und Datenschutz-Imports setzen Hosting im Domain-Root voraus. Unterverzeichnis-Hosting wie `example.com/repo/` benötigt eine gesonderte Pfadanpassung. `/privacy` muss die `privacy/index.html` ausliefern oder auf `/privacy/` umleiten. Für GitHub kann der gewünschte Quellordner nach eigener Freigabe übernommen werden; kein Push und kein neues GitHub-Repository wurde angelegt. Bei Cloudflare einen statischen Auslieferungsweg für den ausgewählten dist-Ordner verwenden. Kein Buildkommando und keine Node-Installation für die Website erforderlich; konkrete Provider-Konfiguration vor Deployment prüfen.

## Externe Abhängigkeiten / nicht exportierbar

- Webradio-iframe bleibt URL-Verweis auf https://webradio.666soundsdesign-broadcaster.com/embed/miniplayer.html . Playercode, Streamserver, Metadaten-/Messaging-/Auth-Funktionen gehören nicht zu diesem Sites-Projekt und wurden nicht kopiert. Im Live-Stand ein Player, im Entwurf zwei wie beauftragt. Autoplay-Freigabe ist keine Wiedergabegarantie.
- Google Fonts DM Sans/Space Grotesk werden weiterhin extern geladen; CSS-Verweise erhalten. Keine Fontdateien kopiert oder Lizenzen umgedeutet.
- Chat-Demo ist lokale, gekennzeichnete Vorschau mit vorbereiteten Antworten. Echte LYVRA öffnet extern in ChatGPT. Der Custom-GPT, seine private Konfiguration, OpenAI-Plattform und Gesprächsdaten sind nicht exportiert.
- Musik-, Community- und GitHub-Links bleiben externe URLs. Repository-Snapshot statisch; keine Laufzeit-API.
- Sites-Plattformzugang, Hosting-Infrastruktur, Domains, serverseitige Logs und Versionshistorie sind keine exportierbaren Website-Funktionen. Kein git-Verzeichnis, keine Zugangsdaten und keine privaten Vault-Daten enthalten. Historische Backuparchive nicht verschachtelt in das Export-ZIP; die vollständigen Live-/Entwurfsquellen sind direkt enthalten.
- Rechtsinhalte im Entwurf bleiben rechtlich nicht vollständig geprüft. Betreiberangaben Dirk Meereis, Hellenstr. 16, 59955 Winterberg, Deutschland/Germany, dirk.meereis@icloud.com erhalten.

## Inhalt erweitern

Nur freigegebene Daten in `draft-project/dist/explorer-data.js` eintragen. Track-/Projektarrays sind aktuell leer. Genre für Track-Zuordnung exakt Psytrance, Dark Techno oder Experimental Sound; Kategorie-IDs visual/story/lyrics/music/code. IDs klein und mit Bindestrichen, keine HTML-Inhalte. approved=true ist eine ausdrückliche Datenfreigabe; audioVerified=true zusätzlich erst nach realem Audio- und Rechtecheck. Keine künstlichen Platzhalter als echte Projekte veröffentlichen.

## Tests / Einschränkungen

Mit Node.js: im draft-project-Verzeichnis `node tests/verify-explorers.cjs`. Funktionstests nutzen Headless-DOM und ausschließlich Testfixtures; dies ersetzt keine Browserprüfung. Datei-Integrität und lokale HTTP-Auslieferung geprüft; keine visuelle Live-gegen-Export-Abnahme, kein echter Screenreader-Test und kein Audio-/Autoplay-Test. Vor unabhängiger Veröffentlichung diese Prüfungen und die übrige Datenschutzprüfung durchführen.
