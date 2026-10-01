# GitHub-Übernahme — prüfbarer PR statt Force-Push

Ziel: `LyvraGPT/` in das öffentliche Hauptrepo auf Basis von `lyvra` aufnehmen.

1. Die ZIP-Datei `LYVRA_GPT_REPAIR_005_2026-10-01.zip` separat sichern.
2. Lokal mit `python LyvraGPT/tests/validate_local.py` und
   `python LyvraGPT/tests/validate_release_005.py` prüfen.
3. In GitHub über sicheren persönlichen Anmeldedialog/MFA authentifizieren;
   niemals Zugangsdaten im Chat veröffentlichen.
4. Im Repo aktuelle Basis `git ls-remote origin refs/heads/lyvra` abrufen.
   Wenn HEAD nicht `a2841aa4e6d6930babd81b7ae974a6d659c51b21` ist,
   **STOP**: zuerst Vergleich/Audit durchführen. Nicht mit altem Stand überschreiben.
5. Nach Entpacken `LyvraGPT/` ins Repo-Root kopieren; keine anderen Pfade ändern.
6. `git switch -c chore/lyvra-gpt-repair-005` von aktualisiertem `lyvra`
   erstellen. Im Git-Index ausschließlich Dateien unter `LyvraGPT/` zulassen.
7. `git add LyvraGPT/`, `git diff --cached --check` und `git diff --cached --name-only`;
   anschließend signierten Commit erstellen, wenn lokale Git-Signierung eingerichtet ist.
8. Arbeitsbranch pushen und Pull Request gegen `lyvra` erstellen, Reviews und CI abwarten.
9. Nach Merge Remote-Readback des neuen Verzeichnisses, des ZIPs und seiner SHA256.
   Erst dann `REMOTE_BACKUP=PUBLISHED` melden.

**Nichts davon wurde in diesem Chat automatisch auf GitHub ausgeführt.**
Ein fehlender GitHub-Writer bleibt ein technischer Blocker.
