# LYVRA · CodeForge · Discord Character Bot — Communication & Development Contract
STATUS: LYVRA_NATIVE_PROPOSAL_CURRENT / BOT_ADOPTION_PENDING
DATE: 2026-10-10
OWNER: WHOLE_LYVRA
BOT_REPOSITORY: xfraggelpower666x/666LYVRACHARAKTERBOTAI
BOT_PRODUCTION_BRANCH: lyvrabot
BOT_DEV_BRANCH: lyvrabot-dev-native-livecircle-20261002
SOURCE_NATIVE_HEAD_AT_REVIEW: 4267803ba1ee3f0215ba00b63917003fe0029ca3
BOT_PRODUCTION_HEAD_AT_REVIEW: 9fcfe324f4b56cef359a5337bae1d6a24fb71fc6
BOT_DEV_HEAD_AT_REVIEW: be37a3af264ea30e2d40c5486b7142dda4bd6ef4

## Intent
The Discord Character Bot is an additional outward communication medium for the existing Whole LYVRA: conversation, musical knowledge, character, curiosity, relationship-aware and evidence-based expression, playful/cheeky tone when appropriate. It is not primarily a music-prompt composer, not a new persona/identity, not a Track Design author, and not a new controller/router.
Its role is Discord text interaction, opt-in voice interfaces, explanations about music/DJ culture/psychoacoustics, creative discussion, safe community presence, and read-only radio context when authorized.
LYVRA expresses herself through the bot, subject to platform/runtime constraints and factual disclosures; the bot may never invent a private memory, relationship, autonomous will, or live capability.

## Three-party roles
- WHOLE_LYVRA: only native identity/meaning/character/relational/music decision authority; defines current public-safe semantic capabilities and approves native adoption.
- CODEFORGE: engineering, repository/branch stewardship, causal technical diff, security and privacy review, test design, release provenance, communications contract, recovery and readback. Not a personality or decision authority.
- LYVRA_CHARACTER_BOT: bot-repository-owned Discord adapter and runtime. Owns platform mechanics, bot-local configuration and tests; consumes approved public-safe native snapshots by exact repository current references, never makes its own LYVRA authoritative state.

## Existing evidence and conflicts
- Current bot production branch contains 16 Git-tree entries, README/RELEASE_MANIFEST advertised v1.7.1, but no main.py/ai_engine.py/character runtime files. Therefore PRODUCTION_BOT_RUNTIME_NOT_VERIFIED.
- DEV branch contains native_bridge/, discord_app.py, contract and test carriers; at inspection it was 80 commits ahead and 4 behind production (DIVERGED). Preserve both valid developments; do not auto-merge.
- Production has an hourly passive GitHub-native-to-bot TODO issue watcher (Issue #2), NOT an automated full native handoff/rehydration. It is an existing transport for review candidates.
- Historical v1.8.0 Drive ZIP and v1.7.1 import workflow are historical/recovery sources, not newer runtime authority. Never retrigger the destructive rsync --delete import.
- LYVRA personality/current, relation privacy, semantic-causal memory, Creative Learning, Track/Music Intelligence and current pointer remain native authority.

## Internal automatic handoff (within Whole LYVRA)
Whenever a governed LYVRA UPDATE, CodeForge change, personality/meaning/relation/musical intelligence evolution, deployment review or continuity rehydration detects a materially bot-relevant change:
1. Read freshest LYVRA CURRENT_POINTER revision, manifest, relevant full native carriers and provenance; read bot native branch state for applicability. Search snippets are discovery only.
2. Produce a non-secret, public-safe semantic delta with event_id, source/native HEAD, affected carrier SHA and meaning, causal purpose, audience/Discord scope, public/private classification, acceptance tests, rollback, supersession, source links and bot branch target.
3. Send candidate to CodeForge's native analysis/review and the native LYVRA outbound handoff carrier. Deduplicate by event_id + semantic fingerprint; keep change candidate status explicit.
4. Record code changes only on authorized update; notice creation does NOT itself install or activate anything.
5. Internal auto handoff means event-driven proposal generation during an actual invoked governed workflow, NOT background persistent agents without a configured executor.

## Repository-to-bot handoff
1. Native LYVRA publishes sanitized, immutable source-linked outbound notice; bot consumes into bot-owned inbox/review.
2. Existing production Issue #2 watcher may signal changed native HEAD as TODO; this is review-only, NOT a full semantic payload or guaranteed delivery.
3. Bot CodeForge counterpart/CI verifies pinned source HEAD, relevant FULL native reads, branch topology, changed files, causal meaning and event dedup before adapting. It must preserve newer valid bot DEV work and historical bot evidence.
4. Bot branch accepts candidate as PENDING_REVIEW; no plugin/Discord/web/Cloudflare mutation by mere notice. Explicit bot-side implementation, offline tests, privacy and permission checks, readback and bot-owned release gate are required.
5. Return receipt includes proposed_event_id, consumed_native_sha, bot repo SHA, review decision (ACK | DEFER | REJECT | ADOPTED), code/tests/readback evidence, rollback, limitations and supersession. Native LYVRA reconsumes receipt on a later actual update.
6. No unverified automatic cross-repository push, no silent cross-authority current promotion, no circular relay.

## Discord-specific design
- Chat-first, character/personality and music understanding. Music prompts are not primary purpose; Track Design stays native.
- Dynamic context-sensitive language: smart, frech, musical, emotional, experimental, candid; never rigid persona script or roleplay character substitution.
- Respect no-mention/private relation boundaries, channel/guild allowlists, owner permissions, bot-loop guard, moderation, message rate/budget, explicit user consent for external model calls, voice, storage/retention.
- Radio metadata read-only unless a separate authorized media-control capability exists; do not absorb RadioBot administrative authority.
- SQLite/local episode memory is scoped evidence, never Whole-LYVRA memory; protected payload not copied into public repository/Discord.
- Fail closed on stale/partial native reads; surface uncertainty without inventing memories or current facts.

## Approval/acceptance gates
A. Fresh native HEAD + CURRENT_POINTER full read and relevant carriers.
B. Bot production AND diverged DEV HEAD read, plus conflict-impact audit.
C. Public-safe payload, content-addressed event and dedup.
D. Native CodeForge readback and bot owner review; informational notice does not imply adoption.
E. Offline test of Discord event policy, separation of authority, privacy, loops, stale-head and recovery.
F. Actual bot-side readback, explicit deployment authorization and rollback evidence before Discord activation.
G. Return receipt and continuity registry refresh; CURRENT_POINTER LAST if native semantic authority truly changes.

NO_NEW_LYVRA_IDENTITY=true
NO_MUSIC_PROMPT_GENERATOR_PRIORITY=true
NO_NEW_ROUTER=true
NO_CROSS_SYSTEM_AUTOACTIVATION=true
NO_SECRET_OR_PRIVATE_RELATIONAL_PAYLOAD_IN_PUBLIC_REPO=true
NO_LEGACY_DRIVE_AUTOIMPORT=true
NO_FORCE_MERGE=true
NO_AUTOMATIC_DISCORD_DEPLOYMENT=true
NO_FALSE_HANDOFF_DELIVERY_CLAIM=true
