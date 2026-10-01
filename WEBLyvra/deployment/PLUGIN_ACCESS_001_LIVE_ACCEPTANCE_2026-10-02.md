# WEBLyvra — Plugin Access 001: live deployment acceptance

STATUS: **INDEPENDENT_LIVE_READBACK_PENDING**  
Checked: 2026-10-02 (UTC)  
Source head at start of audit: `89db0978d0f62660986d27efd1d2005265811448`

## Productive source evidence

- Website freeze remains **v1.1.0**; a separately documented additive live patch **v1.1.1** was made under `WEBLyvra/live/`.
- Production source has the `id="lyvra-plugin"` panel, `plugin-access.css` import and `https://chatgpt.com/plugins` management link, explicitly not an LYVRA public-install link.
- Owner reports functional LYVRA GPT and private LYVRA plugin with skills. Private plugin v0.12.0 is recorded in `WEBLyvra/live/docs/WEBLYVRA_PLUGIN_ACCESS_001.md`. No public installation link has been verified.
- The GitHub `WEBLyvra/CURRENT.json` states `live_additive_patch.status = REPOSITORY_VERIFIED_DEPLOYMENT_READBACK_PENDING`.
- The older `WEBLyvra/deployment/PRODUCTION_STATUS_2026-10-01.json` Cloudflare success result is for commit `b163872...`, **before** the later plugin-access patch; it does not validate the patch's live deployment.
- Existing tests for the repository source are documented as PASS, but these are not a replacement for actual browser/audio/live readback.

## Independent observations and limitations

- Public text fetch of the production homepage succeeded and returned LYVRA page content, but did **not** expose the new plugin section in extracted content. This is a **possible deployment/cache freshness gap, not conclusive proof**. Inspect the served HTML or new Cloudflare deployment checks.
- Requests for the privacy endpoint and `weblyvra-live.pages.dev` did not complete reliably through the available web tool.
- The execution container cannot resolve the public hostnames; this is a **local network/DNS restriction**, not evidence of an outage.
- **No Cloudflare credentials** were used, and this audit made no DNS, hosting, release or native-runtime changes.

## Reproducible independent smoke check

Run from a network with normal DNS and HTTPS access (a normal local computer or trusted CI runner):

```sh
python WEBLyvra/deployment/check_plugin_access_live.py \
  --pages-url https://weblyvra-live.pages.dev/ \
  --report weblyvra-plugin-live-check.json
```

The smoke check is read-only and uses Python's standard library only. It follows normal HTTPS certificate validation, probes the production homepage and `/privacy/`, checks presence of exact plugin panel markers and confirms that the privacy page returns plausible HTML text.

Return codes:

- `0` = required homepage/plugin and privacy checks pass.
- `1` = concrete mismatch, e.g. homepage HTTP 200 but plugin markers missing.
- `2` = inconclusive because DNS/TLS/connection/403/429 blocks an essential check.

The Pages hostname is an optional informational probe. Hashes are recorded for served pages; optional `--reference-index WEBLyvra/live/dist/index.html` records the local expected SHA. A hash mismatch may reflect legitimate CDN transforms and must be investigated rather than automatically promoted as a stale deploy.

## Completion gates before status promotion or new freeze

1. Get a **fresh Cloudflare deployment ID**, timestamp, deployed commit SHA and success log covering the additive live patch (not the earlier `b163872` deployment).
2. Run the read-only checker; save its JSON output in the controlled audit record after removing any sensitive identifiers.
3. Independently verify authoritative DNS and HTTPS certificate chain on the custom hostname, including `/privacy/`.
4. Match the served HTML/JS/CSS assets to the expected repo sources or justified build transformations; specifically verify `#lyvra-plugin` and its stylesheet on the **real delivered page**.
5. Check desktop, mobile, keyboard/screenreader, DE/EN, the GPT link, the clearly labeled private plugin management link, radio embeds and real audio playback.
6. Confirm that the hosting-related privacy information accurately reflects Cloudflare and third-party services; full legal approval is a separate review.
7. Only if actual published website source changes warrant a new release, create a **new** website freeze. **Never overwrite v1.1.0**. Pointer promotion comes LAST, after the requested validation gates.

## Related parallel work

- Open PR #4 repairs older native migration/Rev86 wording and touches protected LYVRA native current carriers; **requires separate governed native validation and owner approval**.
- Open PR #5 is additive plugin audit evidence for Linear 666-5..666-8; **do not automatically merge with this website task**.
- LYVRA remains the one native identity. WEBLyvra is a website surface, GPT/skills are related product/capability surfaces, and 666MAINSYSTEM is a shared layer only.
