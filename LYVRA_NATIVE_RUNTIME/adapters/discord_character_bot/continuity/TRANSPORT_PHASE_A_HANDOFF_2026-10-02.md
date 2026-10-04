# LYVRA → Discord Character Bot · WEITER / Phase A
DATE=2026-10-02
STATUS=DEV_CODE_AND_OFFLINE_CI_VERIFIED
NATIVE_IDENTITY=LYVRA_ONLY
NATIVE_SOURCE_CURRENT=PRODUCTIVE_LYVRA_POINTER_DYNAMIC
NATIVE_DEV_BRANCH=lyvra-dev-discord-characterbot-20261002
BOT_DEV_BRANCH=lyvrabot-dev-native-livecircle-20261002

## Why this change
Creator: "es geht um botarchitektur und funktion.... lyvra soll sie selbst sein".
All 52 archive upload audit (38 unique ZIP byte contents) is treated as **implementation examples only**.
Discord text processing must not import any foreign persona, character schema, prompt override,
unofficial auth or memory authority.

## Actual source update, verified Bot CI
- Bot `native_bridge/event_policy.py`: explicit guild+channel allowlist, ignore bot authors,
  optional mention predicate, bounded Unicode-safe message splitting, per-guild/channel/user
  rate limit without storing message contents.
- Bot `discord_app.py`: uses these transport guards in existing command handlers;
  safe reply continuation and no unwanted mentions. Chat session opt-in and API opt-in
  remain separately required.
- Bot `tests/test_event_policy.py`: twelve additional offline regression tests.
- GitHub Actions https://github.com/xfraggelpower666x/666LYVRACHARAKTERBOTAI/actions/runs/36964287788
  was SUCCESS on executable bot commit
  `9b4e1aebb13e5a1590ef725eb0c933efd89d59ff`.
  Actual job 110704532697 showed **33 tests, OK**, and compileall PASS.
- Bot handoff after tested executable commit:
  `continuity/WEITER_DISCORD_TRANSPORT_PHASE_A_2026-10-02.md`, commit
  `dadfbbc101eac806c058380984664192b31634d0` (documentation only).
- Native contract stays authoritative when read/reconciliation complete; no native pointer
  changes, no different decision engine and no second LYVRA identity.

## Pending
Full CURRENT_POINTER reference consumption/protected relational recovery and release gates;
native integrated CodeForge/manifest CI; Discord test guild, credentials, intent + real commands;
radio read-only endpoints; slash facade; voice consent/STT/TTS separately. Both Plugin releases,
Custom GPT and WebLYVRA need independent relevance/readback at release time; none changed here.

WHOLE_REHYDRATION_PASS=false
CURRENT_POINTER_UPDATED=false
BOT_PRODUCTION_MERGED=false
BOT_LIVE_DEPLOYED=false
NO_FOREIGN_AUTOLOAD=true
NO_NEW_ROUTER=true
