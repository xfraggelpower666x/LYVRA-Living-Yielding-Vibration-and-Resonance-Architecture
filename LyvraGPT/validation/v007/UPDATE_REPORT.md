# LYVRA GPT — Validation Update 007

Datum: 2026-10-02
Scope: ausschließlich additive Validierungswerkzeuge und Gebrauchsanleitung unter LyvraGPT/.
Basis: b61606f1d61d96628b67a4807fa54f76dfc7d950
Pre-Change-Backup: lyvra-backup-pre-gpt-validation-007-20261002
Arbeitsbranch: chore/lyvra-gpt-validation-007-20261002

## Befund und Reparatur

1. Historische Validatoren vergleichen ein reines Originalpaket mit der später erweiterten Publikationsstruktur. Ein neuer Repository-Prüfer prüft Originalarchive und deren Inventar separat sowie die Ergänzungen mit eigenen Prüfsummenlisten. Originaldateien bleiben bytegleich.
2. Der historische Onlineprüfer verlangt einen unveränderten Live-Branch-HEAD. Ein neuer Snapshot-Prüfer liest einen explizit fixierten Commit und verlangt keine Gleichheit mit dem fortgeschrittenen Branch. Historische und produktive Prüfung bleiben getrennt.
3. Neue README_CURRENT.md nennt die korrekten Befehle und deren Prüfgrenzen; die ursprüngliche README bleibt Archiv-Evidenz.

## Governance

Authentifizierter Eigentümerzugang mit push-Recht verifiziert. Basis-HEAD frisch gelesen. Kein aktiver Schreib-Lock im gelesenen Zielbereich gefunden; FREEZE_LOCK beschreibt das unveränderliche historische Paket. Separate Backup- und Arbeitsbranches grenzen den Write ab. Native Runtime, Current-Pointer, Manifest und fremde Systembereiche werden nicht verändert. Kein neuer nativer Versions-/Epoch-Bump nötig für diese Archivwerkzeuge.

## Prüfvertrag

Repository-Integrität, beide Archive, Originaldatei-Erhaltung, historische Snapshotprüfung und aktuelle Snapshotprüfung werden separat getestet. Negative Prüfungen: veränderte Originaldatei, zusätzliche ungeprüfte Datei und unbekannter Commit müssen fehlschlagen. Online-Test nutzt ausschließlich das öffentliche offizielle Repository und einen temporären Clone.

Remote-Readback vor Veröffentlichung: READBACK_PENDING. Tatsächliche Commit-SHA, Testergebnisse und Remote-Readback werden im PR dokumentiert. Keine automatische Merge-/Promotion-Aktion.

Whole-Rehydration bleibt PARTIAL; private Recovery und GPT-Action-End-to-End sind nicht Bestandteil dieses Updates.
