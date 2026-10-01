# LYVRA GPT — Repair 005 (01.10.2026)

Status: **LOKAL VORBEREITET**, nicht gepusht, kein GitHub-Commit/PR, keine neue Whole-Rehydrierung.

## Tatsächlich repariert
1. Freeze-004-ZIP liegt jetzt **im vorgesehenen GitHub-Verzeichnis**:
   `LyvraGPT/releases/LYVRA_GPT_AUDIT_REPAIR_FREEZE_004_2026-10-01.zip`.
2. Das unveränderte alte ZIP bleibt zusätzlich separat archiviert; seine SHA256 ist im Release-Index fixiert.
3. Paketübergreifender Integritätstest, Pfad-/Archivprüfung und eindeutige Veröffentlichungsanleitung ergänzt.
4. Nutzerzustimmung vom 01.10.2026 zu GitHub-Schreiben gilt ausschließlich als Projektfreigabe für den besprochenen LYVRA-GPT-Freeze im Verzeichnis `LyvraGPT/`. Sie **ersetzt weder eine tatsächliche sichere GitHub-Verbindung noch eine technische Schreib-Action**.
5. `LYVRA_NATIVE_RUNTIME/`, Current-Pointer, private Vaults, andere native Systeme und Branch-Protection werden nicht verändert.

## Bewusst nicht repariert
- Die zwei im nativen Rehydration-Manifest fehlenden direkten Mappings
  `VALID_NEWER_EVOLUTION` und `CURRENT_WORK_SCOPE`: erfordern architekturseitige Verifikation,
  bevor autoritative Dateien verändert werden.
- GitHub Branch Protection/Signierung, Action-Schema, Datenschutz-/Rechtsprüfung,
  serverseitige GPT-Editor-Konfiguration und privates Recovery.
- Keine erfundene Whole-Rehydrierung. Aktuell: `REHYDRATION=PARTIAL`.

## Scope und Integrität
- Originalstand `lyvra`: `a2841aa4e6d6930babd81b7ae974a6d659c51b21`.
- GitHub-Remote muss **vor PR-Erstellung** frisch abgeglichen werden.
- Manifest `SHA256SUMS.txt` prüft alle Dateien außer sich selbst.
- `tests/validate_release_005.py` prüft das Paket einschließlich des eingebetteten ZIP.

Dieses Paket ist ein **Konfigurationskandidat**, kein vollständiger GPT-Builder-Export.
