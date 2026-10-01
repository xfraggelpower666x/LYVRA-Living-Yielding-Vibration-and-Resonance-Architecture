# LyvraGPT — isolierter Freeze 004
**Typ:** Lokaler Audit/Repair-/Konfigurations-Freeze-Kandidat; **kein** GitHub-Commit, **kein** veröffentlichter GPT-Export.

Dieses Verzeichnis ist dazu vorbereitet, an der Repository-Wurzel als `LyvraGPT/` abgelegt zu werden.
Es berührt weder `LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json` noch die native Entscheidungsautorität.

## Inhalt
- `gpt/EDITOR_INSTRUCTIONS_DE.txt`: optimierte GPT-Anweisungen (6.234 Zeichen; Grenze 8.000).
- `gpt/EDITOR_CONFIG_CANDIDATE.json`: öffentlich teilbare Metadaten / klar ausgewiesene Lücken.
- `freeze/FREEZE_LOCK.json`: Commit-/Tree-Anker, Fakten, Prüfgrenzen und Freeze-Status.
- `audit/AUDIT_REPORT.md`: Befunde mit Reparaturen und verbleibenden Risiken.
- `audit/DEVELOPMENT_PLAN.md`: nicht ausgeführte Verbesserungen.
- `docs/RESTORE_AND_IMPORT.md`: sichere, manuelle Übernahme.
- `tools/verify_repo_readonly.py`: optionaler GitHub-Originaldatei-/Hash-/JSON-Prüfer.
- `tests/validate_local.py`: lokale Paket-Integritätsprüfung.
- `SHA256SUMS.txt`: Prüfsummen der Paketinhalte (ohne Prüfsummendatei selbst).

## Gültigkeit
Geprüfte Repository-Basis: a2841aa4e6d6930babd81b7ae974a6d659c51b21, Branch `lyvra`.
Ein ZIP ist nur eine Kopie dieses GPT-Teilbereichs, **kein** Ersatz für aktuelle Repository-Authority, privates Vault, GitHub-Sicherung, veröffentlichten GPT oder laufende Sitzung.

## Unvollständige Inhalte
Nicht enthalten sind GPT-Servereinstellungen, Actions-OpenAPI-Schema, Credentials, private Dateien, vollständige Knowledge-Anhänge, Profilbild-Binärdaten, Vault-Inhalte und die komplette native Runtime. Keine Geheimnisse hineinlegen.

## Repair 005 — ZIP auch im Zielverzeichnis
Das vollständige Freeze-004-ZIP liegt unverändert unter `releases/LYVRA_GPT_AUDIT_REPAIR_FREEZE_004_2026-10-01.zip`. Zusätzliche lokale Prüfungen: `python LyvraGPT/tests/validate_release_005.py`. Status und GitHub-PR-Anleitung in `repair/`.
