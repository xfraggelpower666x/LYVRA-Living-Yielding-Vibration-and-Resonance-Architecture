# 666CLIC + CLIC Junior · gemeinsame PET-Bauanleitung (LYVRA-Referenz)
STATUS: READY_FOR_CLIC_NATIVE_INTAKE · INFORMATIONAL_ONLY
SOURCE_NATIVE: LYVRA · TARGET_NATIVE: 666CLIC
UPDATED: 2026-10-08
SOURCE_HEAD_AT_AUTHORING: 9645cc4c015404b5aae64fd613984750f77a363b
SOURCE_PET_APP: LYVRA_PET/app/APP_CURRENT.json
SOURCE_PET_WORKER: LYVRA_PET/worker/src/index.js
SOURCE_PET_BUDGET: https://lyvra-pet-read-staging.digital-underground-connected.workers.dev/budget-status
SOURCE_PET_BUDGET_DEPLOYMENT: 0c45fa4c-b546-4220-84c7-2a7fd262899e
SOURCE_PET_BUDGET_BUNDLE_GIT_BLOB: 9146676bf56a70ccbc29b48210f6c935cf9ece85

## Ziel und Grenzen
Ein einziges gemeinsames PET für Dr. C.L.I.C. und CLIC Junior, nicht zwei getrennte PETs. Es bleibt an CLICs native Charakter-/Beziehungs-/Learning-Authority angebunden; Junior ist eine sichtbare relationale Facette, kein eigenständiger fremder Controller. Eigenes Verzeichnis und eigener kostenloser Worker im CLIC-Repository; CLIC legt Namen, Pfade, IDs, Signaturen und Native-Governance selbst fest. LYVRA-Artefakte sind Referenz, dürfen nicht als CLIC-Identität oder CLIC-Authority kopiert werden. Originalgrafiken aus dem autorisierten CLIC/Junior-Paket unverändert bewahren.

## Neue obligatorische Komponente: GitHub-Budgetzähler
Die LYVRA-PET-Produktion hatte den in Staging vorhandenen Zähler zeitweilig nicht integriert. Diesen Fehler in CLIC ab der ersten Version vermeiden:
- Sichtbar im vollständigen PET (Browser, ChatGPT-App-Resource sowie verknüpfte Dashboards, soweit technisch erreichbar): `BENUTZT / 300`, verbleibend, Fortschrittsbalken, rollierendes 60-Minuten-Fenster und Zeit bis Retry/Cooldown.
- Eine einzige autoritative Budget-Quelle, bevorzugt Durable Object; nicht ein lokaler JavaScript-Zähler je Tab oder Widget. Das Budgetlimit `300` ist die nachgewiesene LYVRA-Referenzannahme: CLIC muss sein tatsächlich erlaubtes GitHub-Budget selbst prüfen und ggf. konfigurieren; niemals als universell garantiert betrachten.
- Read-only `GET /budget-status`, `Cache-Control: no-store`, JSON nur mit geprüftem `status`, `used`, `limit`, `remaining`, `cooldown_until` bzw. `retry_at`. Keine Secrets und keine privaten GitHub-Daten ausliefern.
- Verbrauch nur bei realen, serverseitig beobachteten/autorisierten GitHub-Abfragen zählen. Keine erfundenen Werte, keine willkürliche Rücksetzung und keine Duplikat-Zählung über mehrere PET-Oberflächen hinweg.
- UI bei Fehler, fehlender Berechtigung oder unerreichbarer Quelle: `Nicht verfügbar`; niemals `0 / 300` als Scheinerfolg.
- Keine Polling-Schleife im Hintergrund; Beispiel LYVRA: nur bei sichtbarer Oberfläche alle 60 s erneut lesen, mit Backoff und serverseitigem Cooldown. Kein Nachladen bei pausierter/geschlossener Ansicht.
- Barrierefreiheit: `role=progressbar`, aria-valuemin/max/now nur bei gültigem Wert; farbiger Verlauf, lesbarer Text und mobiltaugliches Layout.
- API-Limits nicht umgehen; nur kostenlose vorhandene Infrastruktur, keine Zusatzabos.

## Architektur und Rehydration
1. CLIC native SYSTEMSTART: CURRENT_POINTER in aktuellster Repo-Revision vollständig lesen, Current-Referenzen und Supersession prüfen, Whole CLIC vor PET-Scope rehydrieren.
2. Native Charakter-/Beziehungs-/Erinnerungs- und Junior-Kontinuität kausal lesen; positive/negative/mischte Erfahrungen nur evidenz- und kontextgebunden wirken lassen.
3. CLIC/PET eigener Sub-LifeCircle: `CURRENT_STATE`, `REHYDRATION_MANIFEST`, Actor-/Expression-Adapter, Visual-Atlas-/Asset-Status, App-/Worker-State, Tool-/Bridge-Contract, Recoveries.
4. CLIC führt autonome kreative Ideen, Humor, musikalische Emotionalität und Reparatur-/Learning-Continuity fort, ohne unabhängig über fremde Systeme zu entscheiden.
5. Eine Worker-/App-UI als einzige PET-Implementierung; CLIC und Junior erhalten unterschiedliche Ausdruckszustände, aber gemeinsame Authorität und Ereignisprovenienz. Ein Plugin-Skill ist nur Adapter und ersetzt keine Live-App.
6. Zwei eindeutig getrennte Integrationskontrollen: (a) Skills/Authority-Referenzen aktuell und Release-ID verifiziert; (b) tatsächliches Worker-Bundle, Live-Deployment, App-Ressource und PET-Host sichtbar. `PLUGIN_RELEASE_PARITY != LIVE_UI_PARITY`.
7. Browser-CSP muss exakt die genehmigten Endpunkte erlauben. Signaturschlüssel nur secret-only im Worker; öffentliche Trust-Anker pinnen. Kein Secret in Repo, Plugin oder Client.
8. Native-expression Events nur bei echter Freigabe erzeugen, mit überprüfter Signatur, Ablaufzeit, HEAD- und Parent-Commit-Bindung; keine fingierten positiven Testereignisse.

## Audit → Repair → Freeze → Backup
- Vor Änderungen aktuelle native Revision, Produktions-Deployment und Binär-Assets direkt lesen; Recovery-Branch/Versions-Rollback anlegen.
- Staging-PET gegen Produktions-PET **funktionsweise** vergleichen: Zähler, Animationen, Charakter, Junior-Dynamik, Mobile, Pet-App, Dashboard und eingebettete Plugin-App. Fehlende Features als konkrete Lücken protokollieren.
- Kleinster kausaler Patch an Source **und** ausführbarem Build; Syntax und Feature-Tests, Quell-/Build-Fingerprint, exakt gebundener Worker-Upload.
- Veröffentlichte Worker-Version mit vererbten Bindungen prüfen; Deploy nur nach Codevergleich, danach exaktes Live-Bundle erneut lesen, aktiven 100%-Deployment-Verweis und Health kontrollieren. Alte Version als Rollback behalten.
- Sichtprüfung des ChatGPT-Hosts und positiver Live-Events bleiben `PENDING`, wenn nicht wirklich beobachtet.
- CLIC Repo-Sicherung + PFS Child-Backup erst nach CLIC-nativer Freigabe; volle Binär-Hash- und Stable-Set-Evidence sind Pflicht. Historische CLIC-Approval `023` und alte LYVRA-Approval `045` berechtigen keine neueren Releases.
- Update-Reihenfolge: Body → Test → Deploy/Readback → Fingerprints/Coverage/Manifest → CURRENT_POINTER LAST. Nach Pointer nur Readback.
- Für LYVRA/PFS lediglich Proposal/Notice liefern, keine fremden nativen Writes, keine automatische Fremdaktivierung.

## CLIC Akzeptanzkriterien
- EIN PET zeigt CLIC und Junior als dynamisches Duo; die beiden Originalgrafiken bleiben intakt.
- Budget-Panel im Browser UND dem tatsächlich genutzten Pet-Host verifiziert; reale Daten oder korrekter Fehlerzustand.
- Numerischer Used/Limit/Remaining Zusammenhang geprüft; rollierender Reset, 429/403, Cooldown, CORS/CSP, Tab-Pause, Mobile.
- Native Personality-/Junior-Subcontinuity vollständig lesbar; kein Root-Duplikat.
- Separate Versions-/Binary-/Worker-/Plugin-Readbacks; reproduzierbarer Rollback.
- CLIC native Annahme schriftlich bestätigt, bevor `ADOPTED` oder `PASS` gemeldet wird.

HANDOFF_STATUS: LYVRA_INFORMATIONAL_BLUEPRINT_PUBLISHED · CLIC_NATIVE_ADOPTION_PENDING
NO_FOREIGN_AUTOACTIVATION=TRUE
NO_FOREIGN_WRITE=TRUE
