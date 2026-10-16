# WEBLyvra – Verified Source Map / Arbeitskarte
Stand: 2026-10-16. Kanonisch: Repository xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture, Branch `lyvra`. Diese Karte vor jeder Website-Reparatur zuerst prüfen und die tatsächlichen Quelldateien read-only nachlesen.

## Veröffentlichung
Cloudflare Pages: `weblyvra-live`, Produktionsdomain `weblyvra.666soundsdesign-broadcaster.com`. Verbundene GitHub-Quelle `lyvra`, Root `WEBLyvra/live`, Build `python tests/audit_static.py && node tests/verify-runtime.cjs && node tests/verify-explorers.cjs`, Output `dist`. Original-Seitenquelle: `WEBLyvra/live/dist/`.

## DOM und tatsächliche Herkunft
- `dist/index.html`: statische Grundstruktur, Hero, Banner, Radiobereich und iframe, Galerieplatzierung.
- `dist/app.js`: Einstieg, importiert `cyber-boot.js`, `dynasty.js`, `i18n.js`, installiert Runtime-Erweiterungen mit `installExtensions()`.
- `dist/dynasty.js`: erzeugt **nachträglich dynamisch** DOM-Container `#dyn-dynasty`, `#dyn-capabilities`, `#dyn-music`, `#dyn-connected`. `#dyn-connected` wird mittels `['radio','connected',connectedContent]` an `#radio > .wrap` angefügt. Daher ist CONNECTED UNIVERSE in Edge sichtbar, obwohl nicht in `index.html` textuell enthalten.
- `dist/dynasty-data.js`: Original-URLs, Beschreibungen DE/EN und Gruppierung `linkGroups.websites/music/community`. Keine Ziele bei Designänderungen ersetzen.
- `dist/dynasty.css`: Darstellung der Dynasty-Erweiterungen einschließlich Cyber-Linkkacheln, Tooltip und mobiler Tap-Information.
- `dist/i18n.js`: Sprachzustand; `lyvra:languagechange` löst Neuaufbau der dynamischen Inhalte aus.
- `dist/audio-neon.js` + `audio-neon.css`: echte Audiopegel aus dem **einen** Webradio iframe; kein zweiter Audiostream.
- `dist/cyber-boot.js` + `cyber-boot.css`: zweiphasiges Web-Intro und mobile Layouts.
- `dist/gallery.js` + `gallery.css`: Bildgalerie/Lightbox; Originalbilder `dist/assets/gallery/`.
- `dist/styles.css`: allgemeines Layout, Frequenzraum-Logo und Radiobereich.
- `dist/dashboard/`, `dist/psy-engine/`, `dist/privacy/`: separate Website-Unterseiten; Änderungen nur auf ausdrücklichen Auftrag.

## Diagnose / Repair Guard
1. GitHub Current im richtigen Branch lesen, dann Cloudflare Projekt und Deployment-Commit vergleichen.
2. Bei Inhalten, die im Edge-DOM aber nicht in index.html stehen: vor Schlussfolgerungen zu Cache **app.js imports und Runtime-Renderfunktionen** durchsuchen, besonders `dynasty.js`.
3. Browser-Konsolenbeleg 2026-10-16: `#dyn-connected.dyn-extension`, `.dyn-links`, `.dyn-link`; Herkunft `dynasty.js`, Daten `dynasty-data.js`.
4. Ein Linkziel bleibt ein eigenständiger Link; Hover erklärt am Desktop, auf Touch öffnet die separate Info-Schaltfläche die Erklärung. Kein Navigieren beim Öffnen der Erklärung.
5. Vor jedem Write Backup/Recovery-Branch, exakte Dateipfade und aktuellen Blob-SHA; Tests, GitHub-Readback, Cloudflare-Deployment, danach Browser-Sichttest. Source-PASS ≠ Host-PASS.
6. Verändere niemals Radio-Repo, PET, Dashboard oder andere LYVRA-Domänen stillschweigend.
