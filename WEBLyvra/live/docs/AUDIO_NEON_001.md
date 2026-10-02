# WEBLyvra — Audioreaktive Neon-Effekte

## Änderung

Additive Erweiterung der bestehenden Website: abschaltbare, standardmäßig deaktivierte Neon-Ebene mit Cyan-Bassringen, violetten Mittenwellen und dezenten Magenta-Höhenimpulsen. Zweisprachige Bedienung im vorhandenen Webradio-Bereich. Keine Audioaufzeichnung, kein Mikrofon, kein zweiter Stream, kein Tracking und kein neuer Speichermechanismus.

Die zwei bestehenden MiniPlayer, Navigation, Inhalte, Logos, Datenschutzseite, Chatdemo und Plugin-Hinweise bleiben erhalten. Reduzierte Bewegung und ausgeblendete Tabs stoppen die Effekte. Ohne aktuelle, validierte Messwerte bleibt die Ebene unsichtbar. Es gibt keine simulierten Beats und keine behauptete direkte Chat-/Studio-Anbindung.

## Technische Verbindung

Der MiniPlayer in `xfraggelpower666x/WebRadio-666SOUNDsDESIGn/public/embed/miniplayer.html` übergibt bereits vorhandene Analyser-Frequenzdaten an `/js/audio-levels.js`. Das Audiograph wird weder neu erstellt noch umgeschaltet. Der Sender verschickt ausschließlich vier normalisierte Pegel, Wiedergabezustand, Protokollversion und Sequenznummer; höchstens 20 Nachrichten pro Sekunde nach expliziter Subscription.

Allowlist: `https://weblyvra.666soundsdesign-broadcaster.com` und die ursprüngliche Sites-Domain. Subscription ausschließlich vom tatsächlichen Parent; Nachrichten ausschließlich an dessen geprüften Origin. Website prüft Sender-Origin, tatsächliches iframe-Fenster, Schema, Wertebereich und Sequenz. Nach 1,5 Sekunden ohne frischen Pegel neutraler Zustand. Zwei Player werden getrennt verfolgt; der stärkere aktuelle Energiepegel steuert die gemeinsame Ebene.

Das GitHub-Readonly-/PFS-/Vault-System ist nicht beteiligt. `CURRENT.json` und historische Releases bleiben unverändert, da dies ein separat dokumentierter Oberflächenpatch ist.

## Partneränderung

Im Webradio-Repository sind ausschließlich die Script-Einbindung, der optionale `publish`-Aufruf und die neue Pegelbrücke vorgesehen. Referenz der identischen Brücke: `docs/integration/radio-audio-levels.js`. Keine Änderung an Streamquellen, EQ, Boost, Admin, Skip, Nachrichtenversand oder Authentifizierung.

## Prüfung

- Statische Integrität, JavaScript-Syntax und lokaler HTTP-Test: PASS.
- Bestehende Runtime-/Explorer-/Sprach-/Preservation-Tests: PASS.
- Neue synthetische Protokolltests: PASS (Origin/Source/Schema/Replay, Timeout, Pause, Ein/Aus, DE/EN, reduced-motion, Tab-Sichtbarkeit, RMS, Mute und Throttling).
- Echte Live-Audioausgabe, visuelle Desktop-/Mobilansicht und Screenreader: noch nicht verifiziert.

Freigabeprüfung: Beide Partneränderungen zusammen bereitstellen; MiniPlayer starten, Effekte einschalten, Bass/Mitten/Höhen beobachten, pausieren, stummschalten, Tab wechseln, DE/EN wechseln und reduzierte Bewegung prüfen. Browser können eine manuelle Play-Geste verlangen. Stream-/Analyser-Verfügbarkeit bleibt Voraussetzung.

## Ergänzung: kompakter iframe ohne schwarzen Leerbereich

`player-fit.js` und die Partnerdatei `/js/embed-fit.js` koppeln die Höhe an die sichtbare Player-Karte. ResizeObserver reagiert auf Responsive Layout und geöffnete EQ-/Messenger-Panels. Messung über Kartenunterkante statt Dokumenthöhe verhindert Resize-Schleifen. Sender und Empfänger prüfen Origin und Window-Identität; erlaubt sind ganzzahlige Höhen von 120 bis 1000 Pixeln. Transparenter Canvas mit normalem Root-Farbschema, dunkle Formulare innerhalb der Player-Karte. Auf Mobilgeräten erhält der LYVRA-Link Platz oberhalb der Controls.

Zusätzlicher Test `verify-player-fit.cjs`: PASS für Origin/Source/Wertebereich, initialen Handshake, Expand/Collapse und doppelte Werte. Visuelle Live-Prüfung bleibt offen; beide Partneränderungen sind Entwürfe.
