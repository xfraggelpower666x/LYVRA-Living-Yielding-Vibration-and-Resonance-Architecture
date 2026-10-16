# WEBLYVRA — EINBAUANLEITUNG / ERSETZUNG DER BESTEHENDEN PLATTFORMKARTEN

**Projekt:** GLOBAL ARTIST DISCOVERY / CONNECTED UNIVERSE — FRAGGELPOWER666 × 666SOUNDsDESIGn  
**Ziel:** LYVRA-Webseite `https://weblyvra.666soundsdesign-broadcaster.com/`  
**Authority:** GitHub, Repository `xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture`, Branch `lyvra`  
**Add-on-Quelle:** `WEBLyvra/artist-discovery/`  
**Status dieser Anleitung:** Integrations-Handoff, noch nicht eingebaut oder deployed.

## VERBINDLICH: VORHANDENE KARTEN ERSETZEN, NICHT DOPPELT AUSGEBEN

Auf der *aktuell öffentlich erreichbaren* WEBLyvra-Seite befinden sich bereits Bereiche mit Karten für:
1. **CONNECTED UNIVERSE / Unsere digitalen Welten** (insbesondere „Websites, Radio & Live“ und „Community & Social Media“).
2. **FRAGGELPOWER666 hören** beziehungsweise weitere bestehende Musik-/Streaming-Karten.

**Die alten Kartencontainer samt ihren alten Abschnittsüberschriften/zugehörigen reinen Kartenbeschreibungen auf der Hauptseite müssen bei der finalen Integration entfallen und durch genau EINE Instanz des neuen Add-ons ersetzt werden.** Dies umfasst duplizierte Plattformlinks in den alten Bereichen. Die neue Instanz übernimmt gebündelt:
- Websites, Radio & Live
- Community & Social Media
- FRAGGELPOWER666 hören & kaufen
- DJ-Mixe & Creator
- Auftritte & Archiv

**NICHT entfernen:** den eigentlichen Webradio-Player, das Radio-Sektionslayout, Header/Navigation, bestehende LYVRA-Identität, Banner/Animation, sonstige Featurebereiche oder unabhängig benötigte Links. Die Aufgabe ist ein gezielter Ersatz der *Kartenlisten*, kein Löschen angrenzender Funktionalität. Keine automatische globale Löschung nach Zeichenkette „Spotify“, „Radio“ oder „Twitch“.

## WICHTIGER SOURCE-/LIVE-DRIFT

Bei Vorprüfung am 16.10.2026 wurde in der Live-Webseite die oben genannte Kartenstruktur gesehen, **im GitHub-Readback von `WEBLyvra/live/dist/index.html` konnten die sichtbaren Überschriften/Karten jedoch nicht wortgleich lokalisiert werden**. Daher vor irgendeiner Löschung:
1. Neuesten kanonischen GitHub-Current sowie aktuell produktiven Cloudflare-Pages-Deploy-Commit verifizieren.
2. Tatsächlich verwendete Build-Quelle und alle möglicherweise nachgeladenen Komponenten/JS-Templates identifizieren.
3. Per DOM-/Quellcode-Abgleich die **konkreten alten Container** einschließlich ihres Laufzeit-Ursprungs bestimmen.
4. Source-/Production-Drift dokumentieren. Bei ungeklärter Herkunft **STOP / INTEGRATION BLOCKED**, nichts auf Verdacht löschen.

## Dateien und Rollen

- `artist-discovery/index.html` – Standalone-Add-on, aktuell mit eingebetteten Plattform-Datensätzen als Vorschau/Prototyp.
- `artist-discovery/preview.html` – lokal ohne Server öffnbare HTML-Vorschau.
- `artist-discovery/data/platforms.json` – kuratierte Metadaten/Links und Prüfstatus; **soll im finalen Modul zur einzigen Anzeigequelle werden**. Die zwei HTML-Dateien enthalten derzeit zusätzlich eingebettete Snapshots. Vor Integration Duplizierung beseitigen oder versioniert konsistent erzeugen.
- `artist-discovery/README.md` – Modul- und Governance-Hinweise.

## Minimalinvasiver Einbauablauf

1. **Rehydration & Readback:** Aktuellen Branch, HEAD/Pointer und Deploy-Quelle prüfen; gültige neuere Entwicklung erhalten. Vorherigen Zustand dokumentieren.
2. **Pre-Change-Safepoint:** Reproduzierbares Backup/Safepoint nach LYVRA-Repo-Policy erstellen; Paralleländerungen/Concurrency absichern.
3. **Ist-Aufnahme:** Alle bisherigen Karten und deren gültige URLs katalogisieren; zwischen Radiowebsite, Twitch-Livestream, Social, Musikstores und persönlichen Benutzerprofilen differenzieren. Bestehende Karten nur dann übernehmen, wenn Quellen belegbar sind.
4. **Integrationsform:** Ein responsives Add-on als **ein logischer Bereich**, eingebunden in bestehende WEBLyvra-Stile und Assetpfade; keine zweite Kopfzeile/zweites Site-Shell oder verschachtelte vollständige HTML-Seite in einer Section. Je nach Architektur die Standalone-Vorschau in DOM-Komponente/Template überführen oder als separaten, sauber verlinkten Add-on-Bereich anbinden.
5. **Datenquelle:** `platforms.json` als Single Source of Truth für Karten verwenden; nur bestätigte Funde bzw. release-spezifisch nachgewiesene DistroKid-Auslieferungen öffentlich anzeigen. Musikstores und unabhängige Plattformen getrennt klassifizieren. Kein Fund und kein Nachweis = kein öffentlicher Eintrag.
6. **ATOMARER ERSATZ:** Erst nach funktionierender Add-on-Integration die genau identifizierten **alten Kartencontainer** entfernen/ausblenden und ihre veralteten zugehörigen Überschriften bereinigen. Vor dem Entfernen alle einzigartigen gültigen Links ins Add-on übertragen. Nie erst löschen und später bauen.
7. **Keine Doppelungen:** Automatischer/visueller Test: eine zusammengehörige Kartenübersicht, keine alten + neuen Abschnitte parallel und keine mehrfachen identischen Ziele ohne absichtliche Unterscheidung.
8. **Qualitätssicherung:** Desktop/Mobil, Fokus/Tastatur, Hover, Screenreader-Labels, externe Links mit `rel=noopener noreferrer`, JSON-Fehlerfälle, Bild/Logo-Fallbacks, Layout, interne Anker, keine Regression des Radio-Players oder anderer Audioeffekte.
9. **Deployment:** Tests und Diff prüfen, Commit/CI abwarten, produktiven Cloudflare-Deploy kontrollieren. Fresh-Host-Browsercheck gegen die echte Domain. SOURCE PASS ≠ DEPLOY PASS ≠ LIVE HOST PASS.
10. **Rückbau:** Vorherigen funktionsfähigen Zustand anhand Safepoint wiederherstellen können, ohne andere neuere Änderungen stillschweigend zu überschreiben.

## Akzeptanzkriterien / Gates

- [ ] Neuester Current, Cloudflare-Deploy und Herkunft der bisherigen Karten tatsächlich bestimmt
- [ ] Pre-Change-Backup sowie Concurrency-Schutz vorhanden
- [ ] Alle einzigartigen gültigen bisherigen Links übernommen
- [ ] Genau eine neue, zusammenhängende Galerie eingebaut
- [ ] Alte „Unsere digitalen Welten“-/„FRAGGELPOWER666 hören“-**Kartenblöcke** nach erfolgreicher Ablösung aus der Hauptseite entfernt
- [ ] Kein doppelter Kartenblock, keine verwaiste Kartenüberschrift
- [ ] Original-Webradio-Player, Twitch/Veluna-/LYVRA-Funktionen unverändert nutzbar
- [ ] JSON als tatsächliche zentrale Karteiquelle; Data Readback gültig
- [ ] Desktop, Tablet, Smartphone und Barrierefreiheit kontrolliert
- [ ] Source-/CI-/Deploy-/Fresh-Host-Readbacks getrennt dokumentiert

**Verantwortung:** Dieses Add-on-Team liefert Daten, Vorschau und Integrationsanleitung. Die Integration, Ersetzung auf der Hauptseite und Cloudflare-Liveabnahme erfolgen ausdrücklich durch **WEBLyvra**, nicht stillschweigend durch das Add-on-Team.

## Eigene Radio-Section und Status-Panels (16.10.2026)

- Der bisherige Radio-Kartenbereich wird durch genau **eine separate Radio-Section** im Add-on ersetzt. Webradio, Veluna, Twitch Broadcast und MiniPlayer sind Zugänge zu Klangräumen, keine technischen Statusmeldungen.
- Status-Endpunkte (Health, Now Playing, AutoDJ, Player Alerts, Discord, Stream) gehören in dedizierte **Status-Panels**, nicht unter Musikplattformkarten.
- Technische Datengrundlage: vom Nutzer übergebene `666STREAM_RADIO_LINK_REGISTRY_v2_2026-10-16.json`, federführend 666STREAM; keine Fremdwrites am Radiosystem.
- **Sämtliche sichtbaren Beschreibungen** müssen im Schreibstil der bestehenden WEBLyvra-Seite verfasst sein (gemeinsamer Frequenzraum, Klang, Emotion, Universum). Registry-Originaltexte und interne Statuscodes dürfen nicht unredigiert übernommen werden.
- Der Prototyp zeigt einen **historischen Prüfstand**, keine Live-Messung. Erst nach autorisierter clientseitiger Anbindung echter öffentlicher GET-Endpunkte mit geprüfter Fehler-/CORS-Behandlung darf eine Anzeige als live gelten. Keine erfundene Verfügbarkeit oder Audio-Wiedergabe.
- Beim späteren atomaren Ersatz auf der Hauptseite keine Radio-/Websites-Karten doppelt stehenlassen. Den originalen Radio-Player und seine Effekte **niemals** löschen.
