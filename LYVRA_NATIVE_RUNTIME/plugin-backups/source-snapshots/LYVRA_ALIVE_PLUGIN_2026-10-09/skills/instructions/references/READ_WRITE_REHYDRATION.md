# LYVRA — READ/WRITE-Rehydration: repo-native Governance-Ergänzung

Diese Referenz ergänzt die native Repository-Authority. Normaler SYSTEMSTART und normaler LYVRA UPDATE arbeiten ausschließlich gegen den produktiven GitHub-Branch `lyvra` und seine CURRENT-Träger.

## Drive-Grenze

Google Drive ist nur HISTORY / BACKUP / RECOVERY. Drive darf im normalen CURRENT-Pfad nicht für Lock-, Writer-, Pointer-, Handoff-, Runtime- oder Update-Governance-Entscheidungen abgefragt werden. Die historische Drive-Lock-Registry bleibt Provenienz, ist aber für normale CURRENT-Updates RETIRED_LEGACY.

## Repo-native Optimistic Concurrency

Vor produktiver Mutation: aktuellen `lyvra`-HEAD frisch lesen, betroffene Blob-SHAs frisch lesen, Scope/Authority bestimmen, Recovery-Branch oder unveränderlichen Commit-Anker vom exakt gelesenen BASE_HEAD erstellen und HEAD unmittelbar vor dem ersten Write erneut lesen.

Während des bounded Updates muss jede Mutation von der eigenen beobachteten Commit-Linie abstammen. Bestehende Dateien nur mit frischem erwartetem Blob-SHA ändern. Vor logisch getrennten Write-Phasen Branch-HEAD erneut lesen. Bewegt sich HEAD auf einen Commit, der nicht aus demselben Update stammt, sofort `CONFLICT_QUARANTINE`; kein Blind-Rebase, Force-Push oder Überschreiben.

`NO_FOREIGN_ACTIVE_WRITER` bedeutet nur: `NO_UNEXPECTED_FOREIGN_HEAD_MOVEMENT_OBSERVED_WITHIN_BOUNDED_UPDATE`. Es ist keine Behauptung, dass kein anderer Writer existiert.

Current-Reihenfolge: BODY → DIRECT READBACK → FINGERPRINT/MANIFEST/COVERAGE soweit nötig → CURRENT POINTER LAST → danach nur Reads.

Plugin-Concurrency nutzt `current_release_id`/`expected_release_id`; Repo-Concurrency nutzt HEAD + Blob-SHA. Drive bleibt außerhalb des normalen Flows.
