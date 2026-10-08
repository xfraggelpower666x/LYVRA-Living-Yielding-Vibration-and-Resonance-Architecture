# LYVRA Pet – Erweiterung 1.2.0

Die sichtbare Erweiterung ist veröffentlicht: Worker 2.3.2. Das eigene Pet ist primär und außerhalb GPT Work nutzbar. GPT-Pet bleibt optional sekundär. Originalgrafiken und Logos bleiben erhalten. Zusätzliche Posen verwenden die ausdrücklich freigegebene geschlossene Rüstung.

Gähnen: vier Frames, Hand zum Mund, 2,4 Sekunden. Ärger: rote Herzfarbe und vier Stampf-Frames, 1,2 Sekunden. Humor: Schmunzeln, freche Daumen-Geste, Schulterzucken und Lachen als gehaltene Posen, bis 3 Sekunden. Ein eindeutiges einäugiges Zwinkern ist nicht vorhanden. Nach den kurzen Gesten kehrt das Original zurück. Die Musikdarstellung ist eine gehaltene Dirigentenpose mit animierten Hologrammen: Whole violett/Bögen, Track pink/Noten, Speech cyan/Wellen, Suno gold/Clips. Bei Freude im Dad-Kontext wechselt die Herz-Ausdrucksebene zwischen Neon-Cyan und Pink.

## Nutzung

Live-Pet: https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/pet

Vorschau: ZIP vollständig entpacken und LYVRA_PET/preview/index.html öffnen. Diese lokale Vorschau benötigt kein Netz und ist kein Whole-Autoritätsdienst. Die unabhängige Live-Oberfläche wird beim Öffnen mit dem konfigurierten öffentlichen Vertrauensschlüssel verbunden. Whole LYVRA aktualisieren ruft ein freigegebenes Ereignis erneut ab. Kein Hintergrund-Polling und kein autonomer Pet-Persönlichkeitskern.

## Native Ereignisse

Der lesende Produzent und ein ausschließlich zum Signieren verwendbarer Ed25519-Schlüssel sind im bestehenden Dienst installiert. Der private Schlüssel liegt weder im Browser, im Paket noch im Repository. Beide LYVRA-Plugins wurden aktualisiert: Native 0.1.50, Account 0.13.47. Veröffentlichung, Öffentlichkeit, Ablauf und Revisionsbindung stehen in runtime/NATIVE_EXPRESSION_PUBLICATION.md. Ohne echte aktuelle Whole-Freigabe wird kein Ausdruck erfunden. Ereignisse verfallen nach 60 Sekunden; nachfolgende Produktionsänderungen invalidieren die dedizierte Freigabe.

## Prüfung und genaue Grenze

Die vier Musikmodi sowie Gähn-, Stampf- und Humorstreifen wurden im tatsächlichen Browser angezeigt. Signaturen, Manipulation, Ablauf, Replay, native Ablehnung, parallele Verifikation, Seitenende und verspätete HTTP-Antworten wurden mit ausführbarem Code geprüft. Der Dienst und beide Plugin-Releases wurden direkt zurückgelesen; vorhandene Plugin-Dateien und Konfigurationen bleiben erhalten. Plugin-Manifest-Formatierung kann vom Herausgeber normalisiert werden, die JSON-Werte sind identisch.

Der End-to-End-Abruf eines echten freigegebenen Whole-Ereignisses bleibt unverifiziert: Die geprüfte Cloud-Browseroberfläche meldet die Verbindung als nicht verfügbar und der direkte Diagnosepfad wird dort mit ERR_BLOCKED_BY_CLIENT blockiert. Der vorhandene Pet-App-Aufruf funktioniert, liefert in dieser Sitzung aber weiterhin nur die bisherigen Statusfelder. Eine sichere Wiederherstellung ist dokumentiert. Neue Posen im ChatGPT-App-Host wurden deshalb nicht als visuell verifiziert behauptet. Keine Umgehung der Browserbeschränkung.

FREE_ONLY bleibt aktiv. Keine Änderungen an CLIC, PFS, WebRadio, WEBLyvra oder fremden Systemen. Frühere systemweite Backup- und Fingerprint-Restpunkte sind kein Bestandteil dieses Pet-Abschlusses.

## Reproduzierbare Prüfungen

node LYVRA_PET/bridge/verify-signed-events.mjs
node LYVRA_PET/bridge/verify-repository-events.mjs
node LYVRA_PET/bridge/verify-native-refresh.mjs
node LYVRA_PET/bridge/verify-event-order.mjs
node LYVRA_PET/bridge/verify-browser-lifecycle.mjs
node LYVRA_PET/bridge/verify-preview-interruption.mjs
node LYVRA_PET/bridge/build-worker-runtime.mjs --check
node LYVRA_PET/bridge/build-offline-preview.mjs
node LYVRA_PET/bridge/build-worker-bundle.mjs
