# Datenschutz-Erweiterung — PARTIAL / unveröffentlicht

Ausgang: Version 5, Commit `95f2b9d88d36cfc09ab58b7a00b2b4abfefc29b9`.
Sicherung: `backups/WEBLYVRA_PRECHANGE_v5_PRIVACY_20261001.tar.gz`.

## Vorbereitet

- Statische Unterseite `dist/privacy/index.html`, vorgesehen für `/privacy`.
- Neun DE/EN-Abschnitte einschließlich aller A–H-Themen sowie Rechtsgrundlagen, Aufbewahrung und internationalen Übermittlungen.
- Bestehendes localStorage-Sprachsystem wird wiederverwendet, kein zweiter Sprachzustand.
- Bestehender Header, Hintergrund, Typografie, Logo, Favicon und Footer übernommen.
- Auf der Hauptseite ausschließlich Footer-Link ergänzt; im Übersetzungswörterbuch ausschließlich ein Sprachpaar ergänzt.
- Kein zusätzlicher Player, KI-Endpunkt, Trackingdienst oder GitHub-Write.
- Deutsche Texte statisch lesbar; englische Texte über den vorhandenen Sprachzustand.

## Geprüfte Datenflüsse

- Sprache: localStorage `lyvra-language`, `de`/`en`, bis zur Löschung lokaler Website-Daten.
- Google Fonts: externes CSS-Import für DM Sans und Space Grotesk.
- Ein bestehendes lazy iframe-Webradio; keine Einwilligungssperre durch `loading=lazy`.
- Musik-/Communitydienste sind Links, keine zusätzlichen Embeds.
- Keine Chatoberfläche, Uploadfunktion, OpenAI-API oder GitHub-API im eigenen Website-Code.
- Über GitHub-Connector vollständig gelesene Repository-Metadaten: angegebenes Repository öffentlich, Standardbranch `lyvra`.
- GPT-Action-Konfiguration nicht geprüft; ausschließlich als separates vorgesehenes GET-Design dokumentiert.

## Quellen

- DSGVO: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- GitHub REST: https://docs.github.com/en/rest/repos/repos
- GitHub Datenschutz: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
- OpenAI Europa: https://openai.com/policies/eu-privacy-policy/
- Google: https://policies.google.com/privacy

## Tests — VERIFIZIERT im Quell-/Renderingtest

DE/EN-Ausgabe, Sprachzustand-Anbindung, Footer-Ziel, alle lokalen Dateien, Syntax und neun zweisprachige Abschnitte.
Responsive CSS für die neue Seite vorhanden. Keine neuen globalen Designregeln.

## Vor Veröffentlichung zu ergänzen / OFFEN

- Verantwortliche natürliche/juristische Person, vollständige Anschrift und bestätigter Datenschutzkontakt.
- Ggf. Datenschutzbeauftragter.
- Konkrete Hosting-Anbieterrollen, Logs, Fristen, Empfänger und Speicherorte.
- Vollständiger Cookie-/Netzwerkaudit und Webradio-Datenflüsse.
- Rechtsgrundlagen und ggf. notwendiges Einwilligungsmanagement bestätigen.
- Tatsächliche GPT-Action-Konfiguration prüfen, bevor sie als aktiv beschrieben wird.
- Browserprüfung und HTTPS-Live-Erreichbarkeit von `/privacy` nach Freigabe.

Veröffentlichung ausgesetzt gemäß ausdrücklichem Nutzer-Handoff: Pflichtfelder sind vor Veröffentlichung auszufüllen. Kein rechtlicher Vollständigkeitsnachweis. Die vorbereitete gespeicherte Version darf bis zur Ergänzung nicht deployed werden; die derzeit veröffentlichte Website bleibt Version 5.

## Ergänzung: vom Nutzer bereitgestellter LYVRA-GPT-Link

DE/EN-Link im OpenAI-Abschnitt ergänzt: https://chatgpt.com/g/g-6abe79b4637481919e42d6085ccdbac3-l-y-v-r-a. Als externer Zugang beschrieben, kein Embed und keine API-Anbindung. Öffentlicher Abruf in dieser Umgebung nicht möglich; GPT-Action-Konfiguration und öffentliche Zugänglichkeit bleiben unbestätigt. Keine Veröffentlichung; Pflichtfelder unverändert offen.

## Handoff V7.1 — Betreiberangaben ergänzt

Verantwortlicher Dirk Meereis; Hellenstr. 16, 59955 Winterberg, Deutschland / Germany; Datenschutzkontakt dirk.meereis@icloud.com. Projekt / Marke LYVRA — A Living Digital Universe / 666SOUNDsDESIGn. Vom Nutzer ausdrücklich bereitgestellt. Die oben historisch als offen aufgeführten Betreiberangaben sind damit ergänzt; übrige rechtliche Prüfungen bleiben offen. Ausschließlich Abschnitt A und dessen statische deutsche Ausgabe geändert. LYVRA-GPT-Link unverändert.

Pre-Change-Backup: backups/WEBLYVRA_PRECHANGE_v7_CONTACT_20261001.tar.gz. DE/EN-Kontaktgleichheit und Erhaltung aller anderen Abschnitte im Quell-/Renderingvergleich geprüft. Entwurf speichern; keine Veröffentlichung ohne ausdrückliche Freigabe gemäß Handoff V7.1.

## Additive Chat-Demo

B/D/G an gekennzeichnete lokale Demo und zweite Player-Einbindung angepasst; Einzelheiten in WEBLYVRA_CHAT_DEMO_DRAFT.md. Kein KI-Backend oder OpenAI-API-Aufruf. Betreiberangaben und GPT-Link erhalten. Kein Deployment.
