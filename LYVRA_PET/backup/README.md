# LYVRA PET — lokales Backup-Register

**Authority:** Whole LYVRA; **Pfad:** `LYVRA_PET/backup/`.

Hier liegen Pet-eigene Sicherungs- und Recovery-Zeiger. Die tatsächliche vollständige Sicherung ist derzeit der unveränderlich referenzierte Git-Commit `300eaf956815832a416b5090d8e5e3820ab78d66` auf dem separaten Recovery-Branch `lyvra-recovery-pre-pet-auto-facet-repair-20261009`.

**Wichtig:** `BACKUP_CURRENT.json` ist ein überprüfter Backup-Index, **keine eigenständige ZIP- oder Binärkopie**. Die Git-Historie enthält den `LYVRA_PET/`-Teilbaum am gepinnten Commit. Für einen vom GitHub-Repository unabhängigen Notfall-Schutz ist weiterhin eine separate, hashgeprüfte Binärsicherung erforderlich.

**Restore:** Recovery-Branch und gepinnten Commit frisch lesen; nur gewünschte `LYVRA_PET/`-Dateien nach exaktem Blob-/Hash-Abgleich wiederherstellen. Frischen produktiven HEAD, Plugin-/Cloudflare-Releases und Backup-Fingerprint abgleichen. Freigegebene Änderungen zunächst auf Recovery/DEV prüfen; Body → Readback → Plugin-Einfluss → Manifest → Pointer-last. Niemals den vollständigen Branch blind auf `lyvra` zurücksetzen.

**Aktueller DEV-Repair:** Die automatische Facetten-UI-Korrektur liegt auf `lyvra-dev-pet-auto-facet-repair-20261009` und ist **nicht produktiv**. Cloudflare Worker V13 ist ein nicht ausgerollter Kandidat. Pet `SOURCE_UNAVAILABLE` und E2E-Facettenautomatik sind weiterhin offen.

**PFS:** zusätzliche Backup-Instanz, kein Pet-/LYVRA-Runtime-Owner; letzter dokumentierter PFS-Transport ist nur partiell und ausdrücklich nicht als vollständiges Backup zu behandeln.
