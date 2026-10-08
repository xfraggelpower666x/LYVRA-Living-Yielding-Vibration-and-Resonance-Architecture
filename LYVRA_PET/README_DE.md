# LYVRA Pet – Erweiterung 1.1.0-candidate

Status: PARTIAL. Der Entwicklungsstand enthält neue Grafiken und ausführbaren Code, noch keine produktiv veröffentlichte Erweiterung.

## Vorschau
ZIP vollständig entpacken und LYVRA_PET/preview/index.html öffnen. Keine Netzwerkverbindung für die lokale Vorschau erforderlich. Modus auswählen und Gähnen, Ärger, Humor oder Musik auslösen. Das eigene Pet bleibt primär, GPT-Pet optional sekundär.

## Neue Grafiken und Darstellung
Vier getrennte PNG-Streifen mit je vier vollständigen Figuren: Gähnen, Stampfen, Humor und Dirigieren. Die geschlossene weiße/silberne Rüstung wurde ausdrücklich freigegeben. Das bestehende Originalsprite bleibt erhalten. Neue Posen werden als zusätzliche Ausdrucksebene gerendert. Gähnen dauert 2,4 Sekunden, Stampfen 1,2 Sekunden und Humor maximal 3 Sekunden. Danach kehrt die Originalfigur zurück. Musik nutzt eine gehaltene Dirigentenpose passend zum Modus mit violettem/pinkem/cyanfarbenem/goldenem Stab und unterschiedlichen Hologrammen. Der Stab ist in den neuen Grafiken tatsächlich gegriffen. Humor und Dirigieren sind gehaltene Posen, keine interpolierten Bewegungszyklen. Die zweite Humorpose zeigt eine spielerische Daumen-Geste; ein eindeutiges einäugiges Zwinkern ist nicht verifiziert.

Bei reduziertem Bewegungsmodus bleiben die Posen statisch. Bei fehlenden Assets bleibt die Originalfigur sichtbar. Originalgrafiken und Logos sind unverändert.

## Signierte Ereignisanbindung
bridge/signed-event-transport.mjs enthält einen Ed25519-Produzenten und Verifizierer. Der Produzent verlangt eine externe native Freigabefunktion und einen nativen privaten Schlüssel. Der Browser erhält ausschließlich vorab vertrauenswürdig konfigurierte öffentliche Schlüssel. Ein Schlüssel aus einer eingehenden Nachricht wird nie vertraut. Ereignisse sind auf öffentliche Ausdrucksfelder begrenzt, an Whole LYVRA, Pet-ID, Quellrevision und Evidenz gebunden und nach 60 Sekunden ungültig. Persönliche Erinnerungen und private Beziehungspayloads werden nicht übertragen.

connectSignedEvidence({getRevision,trustedKeys}) verbindet die Prüfung mit dem Renderer. Der zurückgegebene Controller nimmt signierte Envelopes über accept(envelope) an. Replay, Reihenfolge, Revision, Unterbrechung und Seitenschließen werden kontrolliert. Schlüssel werden nicht mitgeliefert. Es wurde kein privater Schlüssel gespeichert und kein nativer Live-Produzent installiert. Dieser Installationsschritt bleibt offen: vorhandene Whole-LYVRA-Runtime anbinden, Schlüssel nativ verwalten und öffentliche Vertrauensbindung konfigurieren.

## Prüfungen
node LYVRA_PET/bridge/verify-signed-events.mjs
node LYVRA_PET/bridge/verify-event-order.mjs
node LYVRA_PET/bridge/verify-browser-lifecycle.mjs
node LYVRA_PET/bridge/verify-preview-interruption.mjs
node LYVRA_PET/bridge/build-worker-runtime.mjs --check
node LYVRA_PET/bridge/build-offline-preview.mjs
node LYVRA_PET/bridge/build-worker-bundle.mjs

Signatur-, Manipulations-, Ablauf-, Replay- und Lifecycle-Prüfungen bestanden. Das echte Canvas-Rendering wurde mit verlustfrei aus den PNGs gelesenen RGBA-Pixeln geprüft; der direkte Test-Decoder akzeptierte diese PNGs nicht. Das ersetzt keine Browser- oder Hostprüfung. Rendernachweis: preview/new-poses-render-proof.png.

## Offener Abschluss
Native Schlüssel-/Produzenteninstallation, echter Browser-/Plugin-Hosttest der neuen Erweiterung, Auswirkungen auf beide installierten LYVRA-Plugins und produktive Übernahme. Die Cloud-Browserrichtlinie erlaubt keine lokale file:-Vorschau; keine Umgehung. Der bestehende Live-Worker und die produktiven Current-Pointer sind unverändert. Kein neuer Speicher-, Persönlichkeits- oder Autoritätskern wurde geschaffen.
