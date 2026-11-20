---
name: lyvra-intelligent-ui
description: Rendert verifizierte Whole-LYVRA-Projektdaten als interaktives HTML mit Visualformen, Charts, beleggebundenen Aktionen und UI-Handoff.
---

# LYVRA Intelligent UI

Diese Fähigkeit gehört zum Native Skill Runtime von Whole LYVRA. Verwende sie, wenn Fraggle eine interaktive HTML-Projektansicht, eine Visualform, ein Chart oder einen visuellen UI-Handoff ausdrücklich anfordert. Für den normalen Chat-Einstieg gilt weiterhin der native Visualvertrag.

## Ausführen

Löse den aktuellen GitHub-HEAD von `lyvra` auf und lies den Current Pointer, das Manifest und die relevanten Fachquellen. Nutze die vollständige Commit-ID des gelesenen Stands. Der Commit muss im lokalen Checkout verfügbar sein.

```bash
python LYVRA_NATIVE_RUNTIME/current/skills/intelligent-ui/scripts/render_whole_lyvra.py --repo . --revision GITHUB_COMMIT_SHA whole-lyvra.html
```

Mit `--fragment` erzeugt der Skill ein HTML-Fragment. Mit `--checkpoint ui-handoff.json` nimmt er eine gespeicherte Ansicht wieder auf, sofern Projektkennung und Commit übereinstimmen. Für eine fachbezogene Ansicht kann Whole LYVRA einen geprüften Datensatz an `scripts/render_ui.py` übergeben. Das Eingabeformat steht in `README.md` und `view.example.json`.

## Fähigkeiten

- **Projektansicht:** Text, Karten, qualitative Kurven und qualitative Balken. Übergib fachliche Befunde mit Quelle und Status.
- **Visualformen:** Zehn auswählbare Formen mit jeweils eigener Promptvorlage. Die Auswahl ändert nur die Darstellung.
- **Charts:** Vergleich, Verlauf, Zusammenhang und Zusammensetzung. Zahlen übernehmen Einheit und Quelle aus dem fachlichen Datensatz.
- **Visual Daemon und Menü:** Quelle, Grund, Auswirkung, Gegenprobe und Abhängigkeiten je Aktion. Empfehlungen sind Vorschläge. Die Oberfläche führt keine nativen Befehle aus.
- **Wiederaufnahme:** Der UI-Handoff speichert Ansichts-ID, Projektkennung und Commit. Der native Checkpoint bleibt für Fachzustand und Arbeitsfortsetzung zuständig.

Verwende die mitgelieferte `START.html` zur Erkundung der generischen Vorlage. Der produktive Whole-Start bezieht seine Ansicht über den Python-Einstieg und den exakt bezeichneten Git-Commit. Die Anzeige eines passenden Blob-Fingerprints belegt Git-Dateiparität und trifft keine Aussage über einen Plugin-Start oder eine externe Ausführung.
