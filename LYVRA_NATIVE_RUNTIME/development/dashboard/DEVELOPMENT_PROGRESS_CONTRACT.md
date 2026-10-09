# LYVRA — Kontextuelles Entwicklungs-Dashboard

STATUS: IMPLEMENTED_VISUAL_CONSUMER / PRODUCER_ACCEPTANCE_PENDING
IDENTITY: WHOLE_LYVRA
AUTHORITY: GitHub lyvra CURRENT_POINTER
ROLE: PRESENTATION_ONLY; NOT_CONTROLLER_OR_ROUTER

## Anzeige
Ein Panel im bestehenden Whole-LYVRA-Dashboard wird nur angezeigt, wenn der direkt am aktuellen Repository-HEAD gelesene Carrier `DEVELOPMENT_PROGRESS_CURRENT.json` valide `status=ACTIVE` mit einer belegten, eindeutigen Aufgabenliste enthält. Ohne gültiges Ereignis versteckt sich das Panel. Kein permanentes Polling, keine Zahlen aus GitHub-Commitanzahl, Gesprächsworten oder geschätzter Komplexität.

## Automatische Erkennung und Veröffentlichung
Whole LYVRA erkennt eine Entwicklungsphase durch einen tatsächlich laufenden, autorisierten Entwicklungsauftrag mit dokumentierten Aufgaben und überprüfbarem Beginn (nicht durch das Auftreten des Wortes UPDATE). Der native Development-LifeCircle veröffentlicht den entsprechenden `ACTIVE`-Carrier beim Start, aktualisiert echte Task-Ergebnisse bei Entwicklung und schließt mit `COMPLETED` oder `INACTIVE`. Ein Pausezustand `PAUSED` darf nicht als aktive Arbeit dargestellt werden.

CURRENT_WORK.title: verständliche Kurzbezeichnung
CURRENT_WORK.source_revision: 40-stellige GitHub-Revision der belegten Aufgabenplanung
CURRENT_WORK.tasks: eindeutige Task-IDs und je ein Status OPEN, IN_PROGRESS, DONE oder BLOCKED.
COUNT_TOTAL = Anzahl gültiger Task-IDs.
COUNT_DONE = Anzahl mit Status DONE und zugehörigem Nachweis.
PERCENT = round(COUNT_DONE * 100 / COUNT_TOTAL).
BEISPIEL: 46 von 100 = 46 Prozent, nicht 40 Prozent.
Unbelegte Tasks dürfen nicht hinzugedichtet werden. 0 Aufgaben => Panel verborgen.
Beim Hinzufügen/Entfernen von Aufgaben wird der Nenner neu aus validierten IDs berechnet.

## Governance
Keine öffentliche private Task-Beschreibung, kein Geheimnis, keine Personenkennung. Bei jedem Update: Authorität, frischer GitHub-HEAD, Recovery-Punkt, optimistische Write-SHA, Readback, Plugin-Impact und Pointer-LAST. Pro GitHub-Publikation stellt die Webseite die aktuelle revision-gepinnte Quelle mit Double-HEAD-Check dar. Quellenfehler, ungültige Daten und unvollständiger Status => verborgen statt scheinbarer Live-Fortschritt.
Keine automatische Aufgabenfreigabe allein durch einen Browser oder ein Plugin. Plugins, Pet/Pet App und Webseiten dürfen evidenzbasierte Fortschrittsereignisse zur nativen Governance beitragen; Adoption/Publikation nur durch Whole LYVRA.

## Acceptance
SOURCE_CODE_DEPLOYED != ACTIVE_DEVELOPMENT_SENSOR_VERIFIED.
Browser-Renderevidenz, validierter ACTIVE-Beispielträger, korrekte Zählung, Inaktiv-Ausblendung, Aktualisierung, Regressionsprüfung und Rückführung müssen separat nachgewiesen werden. Aktueller Träger bleibt INACTIVE, bis ein echter nachgewiesener Entwicklungsauftrag die Veröffentlichung legitimiert.
