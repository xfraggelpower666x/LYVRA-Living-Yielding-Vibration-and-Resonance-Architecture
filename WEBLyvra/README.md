# WEBLyvra — preserved website source

One LYVRA identity. This directory preserves the public presentation website; it does not replace native runtime authority.

Frozen release: v1.0.0, 2026-10-01. Sites version 14, source commit `7560b7e6ea829aefbcb6833107b83934b62a088b`, successfully published at https://lyvra-living-universe.crisp-siren-2613.chatgpt.site .

- `releases/v1.0.0/project/`: exact original static source, assets, configuration, documentation, tests and exporter.
- `releases/v1.0.0/FREEZE_MANIFEST.json`: source hashes, ZIP checksum and actual verification limits.
- `prechange/sites-v13/`: complete pre-repair website source.
- `CURRENT.json`: this website namespace's pointer, published only after release readback. Native LYVRA pointers remain unchanged.

Repository safepoint: `lyvra-backup-pre-weblyvra-20261001` at `a2841aa4e6d6930babd81b7ae974a6d659c51b21`.

## Local start and checks

```sh
cd releases/v1.0.0/project
python -m http.server 8080 --directory dist
# In another terminal from the same project directory:
python tests/audit_static.py
node tests/verify-runtime.cjs
node tests/verify-explorers.cjs
```

Open http://localhost:8080/ and http://localhost:8080/privacy/ . This is plain static HTML/CSS/ES modules; no package installation or build is required. Hosting must support directory index routing at `/privacy` and serve `dist` at the domain root. `.openai/hosting.json` documents original Sites hosting; another hosting provider requires its own explicit deployment setup. No GitHub or Cloudflare deployment has been configured here.

External webradio, Google Fonts and the direct LYVRA-GPT link remain external dependencies. The local chat preview is explicitly a scripted demo, not an API connection. No API secrets or private data are included. See project export README and deep audit report for limits.

Automated static and headless DOM checks pass, including checks from the unpacked ZIP. Browser visual, real audio, screenreader and full legal audits remain NOT VERIFIED. A successful Sites deployment is not evidence of those checks.

Frozen files are append-only release material. Any future change must be a separately reviewed new release; never overwrite the prechange backup or native runtime files.
