# LyvraGPT — aktuelle Prüfanleitung 007

Diese additive Anleitung ersetzt die Ausführungsbefehle der historischen README für den erweiterten Repository-Checkout. Die Originaldateien, Freeze 004 und Repair 005 bleiben unverändert als Evidenz erhalten.

## Repository-Sicherung offline prüfen

Vom Repository-Root:

```bash
python LyvraGPT/validation/v007/validate_repository.py
```

Der Prüfer verifiziert beide Original-ZIPs, CRC, sichere Archivpfade, deren innere Prüfsummen, die unverändert entpackten Repair-Dateien und das vollständige Repository-Inventar anhand der Publikations- und Ergänzungslisten. Fremde, fehlende und veränderte Dateien führen zu Exitcode 1. Erfolg belegt Sicherungsintegrität; keine GPT-Backend- oder Whole-Rehydration-Prüfung.

Die alten Validatoren `tests/validate_local.py` und `tests/validate_release_005.py` gelten ausschließlich für den Inhalt der Original-Repair-ZIP nach Entpacken in ein separates temporäres Verzeichnis. Im erweiterten Repository-Verzeichnis scheitert ihre historische Inventarliste erwartungsgemäß. Das Archiv wird hierfür niemals verändert.

## Historischen Snapshot prüfen

Mit vorhandener Git-Kopie, ohne Netzwerkzugriff:

```bash
python LyvraGPT/validation/v007/verify_snapshot.py --repo-dir .
```

Oder über einen temporären Clone des offiziellen öffentlichen Repositories:

```bash
python LyvraGPT/validation/v007/verify_snapshot.py --online
```

Standard ist der unveränderte Freeze-Anker aus `freeze/FREEZE_LOCK.json`. Ein inzwischen neuerer Branch-HEAD verhindert diese historische Prüfung nicht.

Für einen bewusst ausgewählten neueren Commit:

```bash
python LyvraGPT/validation/v007/verify_snapshot.py --repo-dir . --commit VOLLSTAENDIGE_40_STELLIGE_COMMIT_SHA
```

Der Prüfer verifiziert den fixierten Git-Commit, historische Tree-Bindung beim Freeze-Anker, Pointer-/Registry-Bindung, Epoch, kritische Fingerprints und gemappte JSON-Dateien. `SNAPSHOT_INTEGRITY=VERIFIED` bedeutet strukturelle Snapshot-Integrität. Inhaltliches Wiederverstehen, private Recovery und vollständige Whole-Rehydration werden dadurch nicht behauptet. Ungemappte Manifest-Domains werden ausdrücklich als PARTIAL gemeldet. Keine Live-Aktivierung, keine Current-Pointer-Promotion, kein Repository-Write.

## Status und Erhaltung

HANDOFF 006 wurde über PR #2 in `lyvra` übernommen, Merge-Commit `2fbed34ecb66156fae3c1ac1ae23a7233ae8cea4`. Readback am 02.10.2026 auf Basis `b61606f1d61d96628b67a4807fa54f76dfc7d950`: Originalarchive und alle ursprünglichen Paketdateien bytegleich; 14 Paket- und 17 Publikationsprüfsummen PASS.

Update 007 ist ausschließlich eine additive Prüfer-/Dokumentationsergänzung unter `LyvraGPT/`. Dessen Veröffentlichung erfolgt über einen separaten PR ohne automatischen Merge. Historische LOCAL/NOT_PUBLISHED-Felder bleiben historische Momentaufnahmen; diese Anleitung verändert sie nicht.
