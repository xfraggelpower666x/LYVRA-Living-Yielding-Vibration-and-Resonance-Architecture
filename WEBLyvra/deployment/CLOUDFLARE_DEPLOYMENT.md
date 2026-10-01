# WEBLyvra — Repository-Deployment und Domain-Umstellung

STATUS: DEPLOYMENT_VERIFIED · USER_BROWSER_CONFIRMED. Cloudflare Pages meldet für Commit `b163872347380b5e0795ea0b8fca1908571005ac` einen erfolgreichen Build/Deploy im Projekt `weblyvra-live`. Der Betreiber bestätigt am 01.10.2026 die Erreichbarkeit der Produktionswebsite und ihrer Datenschutzseite. Direkter Cloudflare-Dashboard-Zugang und unabhängiger HTTP-Readback sind weiterhin nicht verfügbar.

Produktionsadresse: https://weblyvra.666soundsdesign-broadcaster.com/
Datenschutz: https://weblyvra.666soundsdesign-broadcaster.com/privacy
Evidenz: `PRODUCTION_STATUS_2026-10-01.json`. Diese Aktualisierung ändert keine DNS-Einträge oder Website-Dateien.

## Repository-Konfiguration und Betriebsplan

Die vorhandene Website unverändert über Cloudflare Pages aus dem bestehenden Repository bereitstellen. Produktionsbranch: `lyvra`. Projektwurzel: `WEBLyvra/live`. Ausgabeverzeichnis: `dist`. Framework: None. Build-Befehl:

```sh
python tests/audit_static.py && node tests/verify-runtime.cjs && node tests/verify-explorers.cjs
```

Die Tests brechen den Build bei einem Fehler ab. Git-Integration in Cloudflare einrichten; auf Änderungen in `WEBLyvra/live/**` begrenzen, damit native Runtime-Änderungen keinen Website-Build auslösen. Keine API-Schlüssel im Repository erforderlich. Ein Projektname/Account wird erst aus dem authentifizierten Cloudflare-Konto bestätigt, nicht erraten.

## Erhaltenes Umstellungs- und Rollback-Verfahren

Die folgenden Schritte bleiben als Verfahren dokumentiert. Ihre Einzelheiten (DNS-Ziel, Zertifikat, Build-/Watch-Einstellungen und vollständige Funktionsprüfungen) wurden nicht direkt aus dem Cloudflare-Dashboard gelesen. Die bestätigte Erreichbarkeit ersetzt diese Einzelprüfungen nicht.

1. Aktuelle Domain-Zuordnung, DNS-Eintrag und eventuelle Sites-Custom-Domain-Verbindung direkt im Konto prüfen und sichern.
2. Bestehendes Pages-Projekt wiederverwenden, falls vorhanden und passend; andernfalls ein Git-integriertes Pages-Projekt für dieses Repository einrichten.
3. Pages-Deployment mit Commit-Nachweis erfolgreich abschließen; zunächst die vom Anbieter tatsächlich zurückgegebene pages.dev-Adresse testen.
4. Home, `/privacy`, DE/EN, Navigation, Bilder, Chat-Demo/GPT-Link und beide Webradio-Einbindungen auf Desktop/Mobil prüfen. Reale Audio-/Browserprüfung bleibt bis Durchführung offen.
5. `weblyvra.666soundsdesign-broadcaster.com` im Pages-Projekt als Custom Domain hinzufügen. Konflikte mit einer vorhandenen Sites-Bindung gezielt auflösen. Nur diesen Host umstellen; Webradio und andere DNS-Einträge bewahren.
6. CNAME nur auf die tatsächlich bestätigte Pages-Adresse setzen. Niemals einen vermuteten pages.dev-Host einsetzen. Vorher Domain beim Pages-Projekt registrieren.
7. HTTPS, Zertifikat, Home und `/privacy` sowie ausgelieferte Asset-Hashes auf der Zieldomain prüfen. Erst dann den Status LIVE_VERIFIED dokumentieren.
8. Vorherige DNS-Zuordnung und Sites-Version 15 für Rollback behalten. Originalwebsite nicht löschen.

## Datenschutz

Beim Wechsel ändern sich Hosting und technische Datenflüsse. Die vorhandene Datenschutzerklärung wird erhalten, ihre Hosting-Angaben müssen vor der Umstellung gegen die tatsächliche Cloudflare-Konfiguration geprüft und in DE/EN gezielt ergänzt werden. Keine rechtliche Vollständigkeit behaupten. Keine Analytics/Tracking-Dienste aktivieren.

## Betrieb

`WEBLyvra/live` ist der kontrolliert bearbeitbare Website-Quellordner. Releases und Vorversionen sind unveränderliche Sicherungen. Website-Pointer ersetzt keine native LYVRA-Authority. Keine privaten Vaults, Backend- oder Chat-API-Verbindungen eingerichtet.

Offizielle Quellen (am 01.10.2026 geprüft):
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
