# Wiederherstellung / manuelle Repo-Integration
1. ZIP entpacken: Es entsteht ausschließlich `LyvraGPT/` mit Dokumenten, Tests und Kandidatenkonfiguration.
2. `python LyvraGPT/tests/validate_local.py` im übergeordneten Ordner ausführen.
3. Vor Git-Import aktuelle Basis feststellen: `git ls-remote origin refs/heads/lyvra`.
   Erwartet für unveränderte Basis: `a2841aa4e6d6930babd81b7ae974a6d659c51b21`. Falls abweichend: STOP, Änderungen neu überprüfen.
4. Separaten lokalen Branch auf Basis von `lyvra` erstellen; `LyvraGPT/` ins Root der Arbeitskopie kopieren.
5. Prüfen: `git diff --stat`, `git status`, `git diff --check`; nur das neue `LyvraGPT/` zulassen.
6. Nach manueller Autorisierung und gesicherter GitHub-Anmeldung (Passwort/Tokens nie im Chat): auf Arbeitsbranch committen; idealerweise PR mit Review und Statusprüfungen öffnen, statt direkt `lyvra` zu beschreiben.
7. Nach Merge GitHub-Commit/Tree, Upload und Datei-Readbacks nachprüfen. Erst danach `REPOSITORY_BACKUP=PUBLISHED` sagen.
8. GPT-Builder separat: Anweisungen aus `gpt/EDITOR_INSTRUCTIONS_DE.txt` einsetzen, speichern und wieder öffnen; Datenschutz-URL, Action-Schema, Knowledge, Profilbild und Veröffentlichung manuell prüfen. Keine Git-ZIP-Datei kann die serverseitige GPT-Konfiguration selbst wiederherstellen.

## Beispiel (nach eigenem Clone im Repo-Root)
```
git switch lyvra
git pull --ff-only origin lyvra
git switch -c chore/lyvra-gpt-freeze-004
# Verzeichnis LyvraGPT/ aus ZIP in die Repo-Wurzel kopieren
python LyvraGPT/tests/validate_local.py
git add LyvraGPT/
git diff --cached --check
git commit -m "Add isolated LyvraGPT audit repair freeze 004"
git push -u origin chore/lyvra-gpt-freeze-004
# PR erstellen; erst nach Review mergen
```
Dies ist eine ANLEITUNG, keine in dieser Sitzung ausgeführte Schreiboperation.
