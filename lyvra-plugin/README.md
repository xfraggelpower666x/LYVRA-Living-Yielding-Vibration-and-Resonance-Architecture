# L.Y.V.R.A. Plugin

Vollständiger, unveränderter Quellstand des privaten Account-Plugins, Version **0.13.0**. `source/` enthält alle 30 Originaldateien: Manifeste, fünf Fach-Skills und Grundskill, Referenzen und sämtliche Bilddateien. `releases/v0.13.0/` enthält den unveränderten Originalexport sowie eine installierbare ZIP mit denselben Quelldateien. `MANIFEST.json` und `SHA256SUMS.txt` dokumentieren Herkunft und Prüfsummen.

Website: https://weblyvra.666soundsdesign-broadcaster.com/

Der neue PFS-Child **LYVRA Plugin Backup**, Kennung **LYVRAPLUGIN-37001**, System-ID **666PFS-LYVRA-PLUGIN-BACKUP-001**, dient ausschließlich Sicherung, Integritätsprüfung, Versionierung und ausdrücklich beauftragter Wiederherstellung dieses Plugins. Die native LYVRA-Architektur bleibt eigenständig. GPT-Backup und WEBLyvra-Backup sind separate Children. Dieser Plugin-Child ist nicht automatisch ladbar und hat keine Runtime-Autorität.

Dieser Snapshot exportiert keine Zugangsdaten, Kontoverbindungen, Gesprächshistorie oder laufenden Remote-Zustand. Eine Wiederherstellung benötigt erneut die vorgesehenen Verbindungen. Ein neuer Plugin-Release muss erneut vollständig exportiert, geprüft und gesichert werden; es gibt keine automatische Synchronisation. Das Account-Plugin bleibt PRIVATE; die Repository-Sicherung ändert dessen Freigabe nicht.

Wiederherstellung: [RESTORE.md](RESTORE.md). Verifizierten Quellcommit und Archivpfade nach erfolgreichem Readback zuletzt über `CURRENT.json` veröffentlichen.

Die Archive liegen im Repository wegen des Writer-Limits als geordnete binäre `.parts/part-*` vor. `MANIFEST.json` enthält Teil- und Gesamtprüfsummen; Originalexport v0.12.0 bleibt als Recovery-Sicherung erhalten. PFS enthält zusätzlich die vollständigen Archive als normale Dateien.
