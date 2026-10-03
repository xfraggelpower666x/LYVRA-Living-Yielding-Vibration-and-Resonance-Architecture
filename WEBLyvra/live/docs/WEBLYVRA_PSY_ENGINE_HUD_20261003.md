# WEBLyvra – PSY ENGINE und Nutzer-HUD-Buttons

Produktiver Veröffentlichungsweg: bestehendes GitHub-Repository, Branch `lyvra`, Cloudflare Pages `weblyvra-live`, Root `WEBLyvra/live`, Ausgabe `dist`. Offizielle Adresse: https://weblyvra.666soundsdesign-broadcaster.com/ . Sites ist ausschließlich Herkunftsreferenz; dieser Patch veröffentlicht keine Sites-Version und ändert keine DNS- oder Hostingkonfiguration.

Vorherstand und verifizierter Recoverypunkt: Commit `0922287f3ec156ac9637992f674b6f5e80023f60`, Branch `lyvra-backup-pre-psy-engine-hud-20261003`.

Additiv: `/psy-engine/` mit vollständigem Generator aus `xfraggelpower666x/666-sounds-psytrance-engine`, Branch `LYVRA-PSYTRANCE-ENGINE`, Snapshot `f8a97ecd928f9ade293a0717f72a111a0e30d439`; DE/EN-Einstieg unter Sound & Creation. Generatorregeln unverändert. Native Runtime, Pointer, eingefrorene Releases, Avatar-/Audio-/Player-Funktionen erhalten. Rückkehr- und Datenschutzlinks; Offline-Cache löscht nur eigenen Namespace.

Neue Einstiegsbuttons verwenden die unveränderten Nutzeranhänge Neon-HUD-Ring und Cyber-Auge. Originaldateien unter `dist/assets/hud-buttons/`; Beschriftungen bleiben Text, Bilder sind dekorativ mit leerem alt-Attribut, Fokus und reduzierte Bewegung werden unterstützt. Vorhandene Generatorbilder referenzieren vorhandene produktive Avatar-Assets.

Vorher bereits reproduzierbare Buildfehler: Dashboard-Bilder ohne width/height und historischer HTML-Erhaltungsvergleich ohne Ausnahme für den bestehenden Dashboard-Navigationslink. Cloudflare meldete am Vorher-Commit einen fehlgeschlagenen Build. Reparatur: ausschließlich die aus den eingebetteten PNG-IHDRs direkt ermittelten Maße an zwei Dashboard-Bildern ergänzen; Navigation explizit prüfen und für historischen Vergleich nur genehmigten Dashboard-Link und neuen Generator-Einstieg entfernen. Historischer Baseline-Hash unverändert.

Prüfungen: vollständiger produktiver WEBLyvra-Bestand vor Änderung per Git-Blob-SHA geprüft. Statische Integrität/JavaScript/HTTP, Runtime, Explorer-Erhaltungsvergleich, Audio-Neon, Avatar-Präsenz und Player-Fit bestanden. Generatorausgaben und Feldlimits zuvor geprüft. Keine Browser-/Audio-End-to-End-Verifizierung, keine native Whole-Rehydration und keine Suno-/GitHub-Live-Anbindung des Generators behauptet. Speech Design bleibt Entwicklungskandidat. Cloudflare-Erfolg wird erst nach Provider-Readback gemeldet.
