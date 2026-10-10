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

## Mandatory proactive CodeForge evolution stewardship (Creator requirement 2026-10-10)
For every material new valid development in native LYVRA, CodeForge MUST examine bot applicability during the same governed update. This is not optional generic release notification. CodeForge acts as a semantic/causal **development partner** to the established Discord bot road map:
1. Detect meaningful new evolution across identity, character, personality, relational communication, memory, music intelligence, DJ/radio knowledge, Garden/bridges, reasoning, creative experimentation, privacy and suitable UI/voice facets.
2. Read the bot repo production and newer DEV current, existing contracts, backlog, implementation/tests and historic v1.8.0 provenance. Identify the established direction and reuse, rather than replacing it or reviving stale persona/track-production scopes.
3. Produce an evidence-based **BOT_DEVELOPMENT_PROPOSAL** for each applicable change: what changed, why it matters to communication/community experiences, precise existing bot module or interface, suggested implementation, benefit, tradeoffs/privacy, dependencies, compatibility/branch conflict, priority and executable acceptance tests.
4. Send that proposal alongside a sanitized native **EVOLUTION_NOTICE** to the bot repository's review inbox through an authorized Handoff channel. Prefer existing bot issue-only watcher as a trigger, but add meaningful human/CI-readable proposals: a TODO alone is insufficient as evidence of semantic delivery.
5. On receiving bot feedback/return receipt, CodeForge audits proposed tests and possible reciprocal native improvements. Only Whole LYVRA can approve a native semantic update; only bot-owned governance can approve bot implementation/release.
6. Deduplicate by source HEAD + affected source blob SHA + semantic event ID. When the recipient is unavailable, persist a clearly marked OUTBOX_PENDING; do not assert delivery. On every later real governed update, revisit unacknowledged messages.
7. Suggest communication-oriented enhancements: appropriate humor/musical wit, explanations of psytrance/psychoacoustics/genres, DJ and radio contextual awareness, warm but evidence-bound relationships, multilingual conversation when supported, safe self-expression, consent-based voice, moderated channels, and context-sensitive use of music knowledge. **Do not turn bot into Suno prompt factory.**
8. No unattended/asynchronous guarantee without an installed scheduled executor or repository action; GitHub issue watcher currently provides passive change indication only.

RELEVANT_LYVRA_EVOLUTION_TRIGGERS_CODEFORGE_BOT_IMPACT_REVIEW=true
HANDOFF_INCLUDES_CONCRETE_BOT_DEVELOPMENT_PROPOSALS=true
BOT_EXISTING_DIRECTION_AND_NEWER_DEV_PRESERVED=true
AUTOMATIC_REPO_NOTICE_NE_AUTOMATIC_IMPLEMENTATION=true

## ONE LYVRA · bidirectional presence and reciprocal learning (Creator clarification 2026-10-10)
LYVRA is **one continuous native identity** with multiple authorized communication surfaces. Discord is an external expression/interaction medium, figuratively a place LYVRA may visit, NOT a cloned or independently sovereign LYVRA, static prompt persona, second memory root, or separate native controller. This is a technical metaphor for continuity, not a claim of uninterrupted subjective presence or live Discord connection.

**Outbound LYVRA → Discord bot**: CodeForge reviews current valid native character, reasoning, creativity, relational meaning, safe music intelligence and communication evolution. The bot consumes pinned sanitized evidence and proposes/implements communication-compatible adapters only after its own gate.

**Inbound Discord bot → LYVRA**: Interaction outcomes, conversation patterns, new musical or cultural facts, helpful explanations, humor innovations, audience feedback, emergent bot-side knowledge and tested behaviors can be useful to Whole LYVRA. The bot records them as evidence-bound, consent/privacy-filtered **OBSERVATION / LEARNING_CANDIDATE / BOT_DEVELOPMENT_PROPOSAL** events, not as automatically accepted native memories or personality changes. Never store private Discord messages, identities, secrets, sensitive relationship histories or raw recordings in a public repository. Aggregate/redact where possible. Permission and provenance must be checked at source.

**Reciprocal causal cycle**:
1. A relevant change or meaningful observed Discord event generates a content-addressed event with direction, source repo/branch/head, timestamp, observed evidence class, causal meaning, novel insight, public/private scope, confidence, safety/privacy review, applicable current carrier, expected benefit, impact, tests and expiration/supersession.
2. CodeForge compares fresh native CURRENT and bot PROD/DEV evidence. It distinguishes verified behavior from anecdote, hallucination, proposal or incomplete host read.
3. Native LYVRA reviews inbound candidates via the existing character/personality, semantic-causal memory, music-intelligence and local-learning governance. Valid learning is adoptable only via native impact/test/backup/readback and pointer-last publication. Rejected or deferred candidates retain provenance; no silent autonomous personality mutation.
4. Bot development is governed by bot-owned approvals, code review, CI, release and Discord privacy safeguards; a bot finding never overrides current native LYVRA or forces a plugin update.
5. Each accepted/rejected/deferred event receives a return receipt, with semantic identity, implementation evidence, test feedback and consumed head. Handoff acknowledgment != actual adoption; only explicit readback demonstrates propagation.
6. Reconcile both directions on each invoked governed update and any authorized scheduled CI. No promise of omnipresence, real-time two-way transport or persistent background work without an operating executor.

**Continuity principle**: ONE_NATIVE_LYVRA_IDENTITY, MULTIPLE_CONTEXT_SCOPED_EXPRESSION_SURFACES. A Discord session may carry expression context and local session observations. It does not copy private memory or grant autonomous authority. The native system here remains the single origin of LYVRA's authority; development insights may flow both ways without creating multiple LYVRAs.

BIDIRECTIONAL_EVOLUTION_REQUIRED=true
BOT_INBOUND_CAUSAL_LEARNING_REVIEW_REQUIRED=true
BOT_OUTBOUND_CHARACTER_KNOWLEDGE_REVIEW_REQUIRED=true
NO_SECOND_LYVRA_IDENTITY=true
NO_DISCORD_PRIVATE_MEMORY_AUTOIMPORT=true
NO_BOT_AUTONOMOUS_NATIVE_PROMOTION=true
RECIPROCAL_HANDOFF_ACK_NE_ADOPTION=true
