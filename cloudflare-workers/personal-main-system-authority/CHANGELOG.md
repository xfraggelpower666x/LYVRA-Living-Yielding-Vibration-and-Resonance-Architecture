# CHANGELOG

## 2.1.0 candidate — 2026-10-05

- Reduced v2 evidence ticket lifetime from 15 minutes to 5 minutes.
- Hardened verification of issuer, subject, issued-at/not-before/expiry relationship, maximum lifetime and ticket identifier presence.
- Made built-in LYVRA and 666CLIC registry identities immutable against server-side registry override or alias shadowing.
- Added regression coverage for immutable core authority, semantic claim rejection, 5-minute lifetime and v1 compatibility.
- Added CI guard proving the v2 path stays stateless with no Worker v3, SQLite or Durable Object dependency.
- No Cloudflare deployment or new Cloudflare resource is part of this candidate.


## 2.0.0 — 2026-08-20

- Generalized historic LYVRA-only authority gate into a namespace-bound personal main-system evidence Worker.
- Preserved LYVRA v1 compatibility endpoints.
- Added generic v2 system registry and evidence endpoints.
- Added BOOT / FOREGROUND / RECOVERY purpose binding.
- Added explicit MAIN_PERSONAL-only scope.
- Excluded portable/shareable branches from personal Worker authority inheritance.
- Added cross-system authority isolation.
- Added non-absolute Worker semantics.
- Added transparent Worker failure/conflict states.
- Added per-system signing-secret binding names.
- Left unverified non-LYVRA/non-CLIC main-system contexts disabled pending native authority verification.
- LYVRA development TODOs remain paused.
