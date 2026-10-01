# LYVRA Chat-Vorschau — Entwurf / PARTIAL

Ausgang: Sites-Version 8, Commit 19bbdb265ce72d5419155f1b0c10da57be17ef17.
Sicherung: backups/WEBLYVRA_PRECHANGE_v8_CHAT_DEMO_20261001.tar.gz.

## Umsetzung

Additive Vorschau im Bereich Identity unter der vorhandenen Identitätsdarstellung. Deutlich gekennzeichnet als Demo ohne Live-KI. Lokale vorbereitete Antworten für Sound, Identität, Welten und Fallback, über Stichwortabgleich. Drei Vorschläge und freies Eingabefeld, maximal 500 Zeichen, maximal 20 Interaktionen im flüchtigen Verlauf. Keine Chat-Anfragen, keine persistente Speicherung. Reset und Neuladen löschen den Verlauf. Nutzertext ausschließlich textContent. Kein vorgetäuschter Online-, Tipp- oder KI-Status.

Vorhandene DE/EN-Auswahl wird verwendet; Vorlagen und Demo-Antworten wechseln die Sprache. Freie Nutzereingaben bleiben unverändert. Der zweite iframe über dem Chat bleibt beim Sprachwechsel erhalten. Button öffnet die echte LYVRA unter dem vom Nutzer gelieferten ChatGPT-Link in neuem Tab, mit noopener noreferrer.

## Miniplayer / Autoplay

Zusätzlicher iframe mit bestehender URL, Höhe 365, loading=eager und allow=autoplay. Vorhandener Webradio-Player unverändert. Die Freigabe erlaubt Autoplay unter geeigneten Browserbedingungen; sie startet selbst keine Wiedergabe. Kein unbestätigter URL-Parameter oder postMessage-Vertrag erfunden. Tatsächliches Autoplay ist OFFEN: externer Quell-/Live-Abruf nicht verfügbar, keine direkte Kontrolle über Cross-Origin-Player. Zwei Player können gleichzeitig wiedergeben; die vorhandene Radioanbindung wurde auftragsgemäß erhalten.

## Datenschutzentwurf

Abschnitte B/D/G und statische deutsche Ausgabe an Demo und zweiten Player angepasst. Betreiberangaben und GPT-Link unverändert. Andere rechtliche Prüfungen bleiben offen.

## Verifikation

Syntax geprüft. Acht Routingfälle, DE/EN-Kataloggleichheit, fehlende Chat-Netzwerk-/Speicher-APIs, sichere Texteingabe, Original-HTML nach Entfernen des Zusatzblocks identisch, Original-app.js nach Entfernen der Initialisierung identisch, ursprünglicher Player unverändert, Reihenfolge Radio/Chat und externer GPT-Link geprüft. Keine Desktop-/Mobil-Browserprüfung oder Audio-Liveprüfung durchgeführt. Scoped responsive CSS vorhanden.

## Veröffentlichung

Nur als Entwurf gespeichert. Keine Freigabe für Veröffentlichung erhalten; Datenschutzseite bleibt unveröffentlicht. Live-Website unverändert.
