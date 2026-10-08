# Logoänderungen – v1.0.2

Bild 1 (00_10_06): assets/plugin-logo.png, unveränderte Quelldatei. In beiden Manifesten als logo und composerIcon verknüpft.

Bild 2 (00_14_03): assets/app-logo.webp, 256 × 256 Pixel, 9.056 Bytes, transparent. Für das 10-KB-Limit verlustbehaftet komprimiert und Alphakanal auf transparente/deckende Pixel reduziert. Vollständiges Motiv ohne Beschnitt. Alternative für App-Uploads ohne WebP-Unterstützung: assets/app-logo.jpg, ebenfalls 256 × 256 und unter 10.000 Bytes, mit schwarzem Hintergrund.

Das bisherige assets/app-logo.png ist unverändert erhalten, aber nicht mehr als aktuelles Applogo im logo-map.json ausgewählt.

Die bestehende App-ID und Verbindung bleiben erhalten. .app.json bindet die bestehende App ein und kann deren serverseitiges Logo nicht überschreiben. Das gewünschte Applogo muss in der bestehenden App-Verwaltung hochgeladen werden. logo-map.json dokumentiert die Zuordnung, ist jedoch keine automatische App-Konfiguration.

Direktes Plugin-/App-Update nicht ausgeführt. Keine Pet-Runtime oder Fremdsysteme geändert.
