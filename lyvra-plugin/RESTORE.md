# Plugin wiederherstellen

1. `CURRENT.json` lesen und den dort verzeichneten Quellcommit verwenden. Nur die in `MANIFEST.json` dokumentierte Plugin-Version sichern oder wiederherstellen.
2. Im Verzeichnis `lyvra-plugin/` mit `sha256sum -c SHA256SUMS.txt` alle 30 Quelldateien und alle Archivteile prüfen. ZIP-CRC und die vollständige Dateiliste ebenfalls prüfen. Bei einer Abweichung nicht importieren.
3. Vor einem Import die Archivteile in der dokumentierten Reihenfolge mit `cat releases/v0.13.0/LYVRA_PLUGIN_v0.13.0_2026-10-01.zip.parts/part-* > LYVRA_PLUGIN_v0.13.0_2026-10-01.zip` zusammensetzen und die Gesamt-SHA256 aus `MANIFEST.json` prüfen. Den Originalexport `.tar.gz` auf gleiche Weise zusammensetzen. Die installierbare ZIP unter `releases/v0.13.0/` enthält die Plugin-Dateien direkt an ihrer Wurzel. Den Originalexport `.tar.gz` unverändert als zusätzliche Herkunftssicherung behalten.
4. Eine Account-Plugin-Wiederherstellung nur nach ausdrücklichem Auftrag über Plugin Creator durchführen. Das bestehende Account-Plugin anhand seiner Plugin-ID auflösen; keine fremde Plugin-Identität überschreiben. Gewünschte Sichtbarkeit und erforderliche Kontoverbindungen wiederherstellen, ohne Zugangsdaten im Repository zu speichern.
5. Nach dem Import alle Plugin-Dateien erneut exportieren und gegen die Soll-Dateiliste vergleichen. Skills, Manifeste, Website-Referenz und Bilder prüfen; verbundene Dienste separat anhand ihrer aktuellen Berechtigungen testen. Einen Erfolg nur mit überprüftem Ergebnis melden.

PFS-Child: LYVRAPLUGIN-37001 / 666PFS-LYVRA-PLUGIN-BACKUP-001. PFS hält separate bytegleiche Archivkopien und die Readback-Quittung. PFS ist Backup und Wiederherstellungssicherung; es ersetzt weder das Account-Plugin noch die native LYVRA-Quellarchitektur.
