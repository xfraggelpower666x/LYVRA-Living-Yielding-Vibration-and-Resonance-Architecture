# WEBLyvra – Quellcode und Wiederherstellung

`project/` enthält den ausgewählten vollständigen Stand. Ein optionaler `prechange/`-Ordner enthält einen ausdrücklich benannten alten Stand. Er ist ein Wiederherstellungspunkt, keine aktuelle Live-Version. `MANIFEST.json` enthält SHA-256-Werte und explizite Versionsinformationen. Ohne Publikationsparameter behauptet der Export keinen Live-Status.

## Start

Python 3 installieren, ZIP entpacken und im Paketordner ausführen:

```
python -m http.server 8000 --bind 127.0.0.1 --directory project/dist
```

http://127.0.0.1:8000/ und http://127.0.0.1:8000/privacy/ öffnen. Kein npm, React, Vite, Backend oder Buildschritt erforderlich. ES-Module benötigen HTTP; nicht mit file:// öffnen.

## Struktur und Prüfungen

`dist/`: vollständiges Webroot mit HTML, CSS, ES-Modulen, Bildern und Datenschutz. `docs/`: Berichte und Grenzen. `tests/`: reproduzierbare Prüfungen außerhalb des ausgelieferten Webroots. `scripts/`: Export. `.openai/hosting.json`: bestehende Sites-Zuordnung, keine Zugangsdaten.

Im Projektordner:

```
node tests/verify-explorers.cjs
node tests/verify-runtime.cjs
python tests/audit_static.py
python scripts/export-project.py WEBLyvra.zip
```

Der Export funktioniert auch ohne Git-Historie aus dem ausgepackten Projekt. Bei einem vorhandenen Sites-Checkout kann mit `--source-ref COMMIT` ein exakter Commit exportiert werden. `--published-version NUMMER --published-commit COMMIT` nur nach bestätigter Veröffentlichung verwenden. Optional `--prechange-ref COMMIT` für einen vorhandenen früheren Quellstand.

## Deployment und Grenzen

Nur `project/dist` im Domain-Root ausliefern; Berichte, Tests und Sicherungen gehören nicht ins Webroot. `/privacy` muss `privacy/index.html` ausliefern oder nach `/privacy/` umleiten. Unterverzeichnis-Hosting benötigt eine gesonderte Anpassung der absoluten Pfade. Keine automatische GitHub-Pages-, Cloudflare- oder DNS-Einrichtung im Paket. Repository-Sicherung ist keine Hosting-Migration.

- Zwei Webradio-iframes verweisen auf den bestehenden externen Miniplayer. Playercode, Stream, Messaging, Anmeldung und Metadatenserver sind nicht Teil dieses Projekts. Autoplay ist nicht garantiert.
- Google Fonts werden extern geladen; Fontdateien wurden nicht kopiert. Schriftlizenzen und Anbieter-Datenflüsse separat prüfen.
- Der Chat ist eine ausdrücklich gekennzeichnete lokale Demo. Der echte LYVRA-GPT wird extern geöffnet. GPT-Konfiguration, Gespräche und GitHub-Action sind nicht exportiert.
- Evolution ist ein datierter Snapshot. Keine private Vault-Anbindung, Repository-Laufzeit-API oder neuen Zugangsdaten.
- Track- und Projektlisten sind leer, bis freigegebene Daten vorliegen. Keine künstlichen Veröffentlichungen.
- Rechtsinhalte mit vorhandenen Betreiberangaben sind erhalten. Hosting, Rechtsgrundlagen, Aufbewahrung und externe Datenflüsse sind noch nicht abschließend geprüft.
- Headless-DOM- und lokale HTTP-Prüfungen ersetzen keine echte Browser-, Screenreader-, Audio- oder Mobilabnahme.

`WEBLyvra/CURRENT.json` in der LYVRA-Repository zeigt ausschließlich auf diesen Website-Freeze. Er ersetzt keinen nativen LYVRA-Pointer.
