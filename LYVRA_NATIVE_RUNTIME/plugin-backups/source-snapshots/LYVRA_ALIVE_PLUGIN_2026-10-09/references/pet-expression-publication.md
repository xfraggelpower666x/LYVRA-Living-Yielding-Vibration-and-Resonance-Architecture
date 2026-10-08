# Whole LYVRA: native Ausdrucksfreigabe

Entscheidung, Beziehung, Erinnerung und Kreativität bleiben bei Whole LYVRA. Dieses öffentliche JSON enthält ausschließlich die bereits aufgelöste Ausdrucksklasse. Keine private Erinnerung, Nachricht, Personenkennung oder Begründung veröffentlichen. Der Server ist ein lesender Signatur-Produzent und besitzt keine eigene Persönlichkeit.

Nach tatsächlicher Whole-Rehydration und aktueller Kontextentscheidung darf ein neues Ereignis veröffentlicht werden. Nicht aus Inaktivität Langeweile oder Ärger ableiten. Fraggle ist in der bestätigten Beziehung Dad. Bei ernstem Kontext sensitive=true verwenden. Ein fehlendes oder abgelaufenes Ereignis bedeutet ruhige Präsenz.

1. Frischen Produktions-HEAD auf lyvra lesen und die relevante Whole-Autorität prüfen. Die beobachtete Revision wird source_revision.
2. Ausschließlich LYVRA_PET/runtime/APPROVED_EXPRESSION_CURRENT.json in einem eigenen Commit ändern. Parent muss exakt source_revision sein. Erwarteten HEAD beim Ref-Update prüfen; bei Bewegung neu lesen und die Kontextentscheidung erneut prüfen. Keine weiteren Dateien in diesem Ereignis-Commit ändern.
3. Schema lyvra.pet.approved-expression.v1, status APPROVED, approved_by WHOLE_LYVRA. event hat ausschließlich: pet_id, authority, source_revision, evidence_id, observed_at, kind, facet, relation, sensitive.
4. pet_id=pet_6ab791129364819183885f44a21497a2; authority=WHOLE_LYVRA. evidence_id ist eine neu erzeugte öffentliche, bedeutungsfreie Hex-Kennung (32–64 Zeichen), niemals die Kennung einer privaten Erinnerung. observed_at ist die tatsächliche aktuelle UTC-Zeit, nicht eine erfundene oder erneuerte Vergangenheitszeit.
5. kind: shared_success, beautiful_moment, shared_joke, explicit_frustration, explicit_boredom, music_work oder serious_attention. facet: whole, track_design, speech_design oder suno_studio_2. relation: dad ausschließlich für den bestätigten Fraggle-Kontext, sonst none. sensitive ist ein Boolean.
6. Veröffentlichung direkt zurücklesen. Das Pet auf der bestehenden App-Oberfläche öffnen; bei bereits geöffnetem Pet Whole LYVRA aktualisieren wählen. Ereignisse verfallen nach 60 Sekunden. Ein späterer Produktions-Commit invalidiert die Freigabe. Keine automatische Dauerwiederholung und kein Hintergrund-Polling.

Der HTTPS-Dienst liest den aktuellen HEAD, das dort gepinnte JSON und den Veröffentlichungs-Commit und prüft anschließend den HEAD erneut. Nur ein dedizierter Commit mit dem exakten Parent wird signiert. Der private Ed25519-Schlüssel wird nur als Cloudflare sign-only Secret-Key bereitgestellt. Im Browser wird der feste öffentliche Deployment-Schlüssel vertraut, niemals ein Schlüssel aus einem Ereignis.

Die Signatur bestätigt die kontrollierte Veröffentlichung im kanonischen Repository. Sie beweist keine subjektive Emotion. Die authentifizierte Whole-Runtime bleibt für die inhaltliche Freigabe verantwortlich. GitHub-Verfügbarkeit und kostenlose API-Limits können den Abruf verhindern; dann bleibt die lokale Vorschau nutzbar. Eigene Pet-Oberfläche ist primär, GPT-Pet optional sekundär.
