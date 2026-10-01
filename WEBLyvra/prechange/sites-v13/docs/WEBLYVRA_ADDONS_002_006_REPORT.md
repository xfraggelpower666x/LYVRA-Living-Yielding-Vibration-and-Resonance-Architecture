# LYVRA Add-ons 002–006 — Entwurf / PARTIAL

Ausgang: Sites-Version 10, Commit 11730b1f4b01ba25de4b7b4749e4ca4f7ceb258e. Sicherung: backups/WEBLYVRA_PRECHANGE_v10_ADDONS_20261001.tar.gz (dist, .openai und docs; ältere Sicherungen bleiben separat).

## FOUND

- Universe: Sound, Art, Story und Emotion mit Tab-Auswahl, Pfeiltasten/Home/End, Detailpanel und Orbit-Darstellung.
- Sound & Creation: audiovisuelle Präsentation, Klangprinzipien, musikalische Herkunft und freigegebene Plattformlinks; keine Trackliste.
- Creative Lab: drei Prozesskarten (Track Design, Visual Resonance, Causal Storytelling), native details sowie Capability-Informationen; keine Projektgalerie.
- LYVRA World: vorhandene World-Präsentation, keine auswählbaren Ortskarten oder Game-Runtime.
- Evolution: bisherige Entwicklungsdarstellung und Handoff 001 als datierter Snapshot.
- Identity: lokale Chat-Demo und zusätzlicher Miniplayer; Datenschutz mit DE/EN-Betreiberangaben. Diese Inhalte gehören zum Entwurf, nicht zu Live-Version 5.

## ADDED

002: Bestehende Sound-/Art-Tabs um Music & Sound beziehungsweise Creative Lab ergänzt. Fünf zusätzliche Tabs: CodeForge, Analytics, Music Memory, Garden, Operations & Self-Conductor. Story und Emotion bleiben erhalten. Neun eindeutige Tabs insgesamt, sieben native Informationsbereiche ohne zweite Identität. Ursprüngliche Tabtexte und Beschreibungen nicht ersetzt.

003: Drei auswählbare Musikwelten, Track Explorer mit ehrlicher Leerdarstellung, getrenntes Track-Datenmodell. Audio nur bei explizit freigegebenem Datensatz und audioVerified=true, HTTPS/lokaler zulässiger Quelle, native Browser-Steuerung und preload=none. Keine Audiowiedergabe oder Autoplay neu aktiviert. Keine freigegebenen Tracks geliefert; tracks=[] bleibt leer.

004: Fünf Kategorien plus Alle-Filter, wiederverwendbare Projektkarten/Detail/Zurück, gültige Links, optionale Bilder mit Alttext, Datenmodell und Leerdarstellung. Keine freigegebenen Projekte geliefert; projects=[] bleibt leer. Funktionalität mit nicht ausgelieferten Testfixtures geprüft.

005: Symbolische Orte The Origin, Resonance Fields, Creation Nexus, Memory Garden, Code Citadel; Auswahl, Detail, Zurück und echte interne Zielanker. Als Konzepte markiert, keine Game-Runtime oder privaten Erinnerungen.

006: Vier auswählbare Informationskarten Public, Registered, Admin und Hauptadmin. Public bezeichnet die vorhandene öffentliche Darstellung, keine privilegierte Benutzerrolle. Andere Zugänge explizit geplant/nicht verfügbar. Fünf Architekturgrenzen und Authority-Prinzipien dokumentiert. Keine Loginfelder, Schein-Administration oder Backend-Anbindung.

## MODIFIED

- dist/app.js: Datenimporte, Erweiterung der Tabdefinitionen ohne Überschreiben bestehender Facetten, additive Initialisierung und Auswahlereignis.
- dist/index.html: ausschließlich CSS-Referenz ergänzt; Add-on-Bereiche werden lokal initialisiert.
- Neue Dateien dist/explorer-data.js, dist/explorers.js, dist/explorers.css.
- Neue Tests, Exportskript und Dokumentation. Kein neues Runtime-Paket, kein Frameworkwechsel.
- CSS auf .lyvra-addon/native-facet-detail beschränkt; vorhandene facet-tabs erhalten notwendige Umbruchregeln für die erweiterte Auswahl.
- Handoff 001, alle bisherigen Inhalte, Originaldesign-CSS, Bilddateien, Player und Datenschutzdaten unverändert.

## TESTED / VERIFIZIERT

node tests/verify-explorers.cjs: Headless-DOM-Test für neun eindeutige Facetten; Musik-Auswahl; sechs Kategorienfilter; fünf Orte mit Detail/Zurück und gültigen Zielankern; vier Gateway-Karten/Status; DE/EN; Ablehnung unsicherer URLs und nicht freigegebener Daten. Projekt-Detail und Audio-Freigabe mit synthetischen Testfixtures ausschließlich im Testprozess geprüft, nicht in ausgelieferten Inhaltsdaten. Vorhandenes HTML nach Entfernen des neuen CSS-Links identisch; Handoff-001-CSS identisch zum Ausgangscommit. Syntax der neuen Module und app.js geprüft. Keine Netzwerk-, Speicher-, GitHub-Schreib- oder Vault-Funktionen in den neuen Modulen. Neue Add-ons nutzen keine lokalen persistenten Daten. Bestehende Sprachpräferenz bleibt wie zuvor.

## NOT VERIFIED / OFFEN

Keine echten Track-/Projektkarten mit realen freigegebenen Daten, keine Audioquelle geprüft. Browser-, Screenreader-, Touch- und visuelle Desktop-/Mobilprüfung nicht durchgeführt; semantic HTML, Fokus, aria-Zustände, responsive CSS und reduced-motion-Regeln vorbereitet. Neue Module wurden in einem DOM-Test, nicht in einem echten Browser ausgeführt. Webradio und ChatGPT sind externe Angebote; deren öffentliche Erreichbarkeit/Autoplay nicht bestätigt. Keine Produktionsumgebung, Nutzerverwaltung oder Game-Runtime implementiert. Keine automatischen Updates geplant/eingerichtet.

## READY

Implementierter Entwurf zur Durchsicht. Vollständige Abnahme noch PARTIAL wegen Browser-/Medienprüfung und fehlender freigegebener Track-/Projektdaten. Keine Veröffentlichung oder Migration. Kein GitHub-Write über das GitHub-Plugin; nur öffentliche Metadaten gelesen. Sites-eigene Quellversionsspeicherung ist vom externen GitHub-Repository getrennt.
