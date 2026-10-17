# LYVRA Discovery Intelligence — Native Facet Proposal
Date: 2026-10-17
Status: PROPOSAL ONLY · NOT NATIVE-INTEGRATED · NOT REHYDRATED

## Origin: validated discovery case
The artist discovery work initially surfaced 5, then 10, then 18 SoundCloud links via ordinary queries. An interactive public browser scroll of the artist's /albums listing exposed 30 album/EP listings with titles and canonical links. Treat this as an evidence-backed example of method-selection improvement, NOT proof of broad plugin reliability or a self-learning model.

## Identity and native boundaries
- Discovery Intelligence is a LYVRA-owned capability, not another LYVRA identity, system controller, router or foreign-system activation.
- The native main LYVRA rehydration remains the primary start/authority. This facet has a scoped LiveCircle and scoped rehydration dependency.
- Root native CURRENT_POINTER current revision and relevant references must be fully read before authority, current-state, or native-writes claims.
- Whole-system coverage precedes specialty work. If missing: PARTIAL / READBACK_PENDING.
- Preserve valid newer evolution, provenance, supersession, original native authority.
- No unsolicited tool/account actions, invasive writes, or self-modification.

## Scoped LiveCircle (proposed)
1. Identity binding / source pointer revision and upstream LYVRA head.
2. Source registry: public links, connected plugins, supported affordances, latency/rate limits, trust class.
3. Task intent, source hypotheses, semantic query expansion with explicit constraints.
4. Research attempts and tool receipts (input, source URI, method, result, timestamp, scope, failures).
5. Evidence graph: claim -> source -> independently checked readback; positive, negative and inconclusive separate.
6. Causal test log: why method A failed, what observation justified method B, what changed.
7. Learning registry: versioned reusable strategies and anti-patterns; confidence and expiration, not silent belief promotion.
8. Safety and scope gate: no login/permissions escalation without user authorization; no synthetic receipts.
9. Continuity checkpoint, recovery metadata, open uncertainties and next meaningful action.

## Discovery loop
Question -> classify intent -> inspect known source coverage -> choose minimal evidence-appropriate method -> perform tool read -> verify -> dedupe -> compare previous state -> propose next method -> record provenance -> summarize confidence. Max 3 repeated verification loops without progress; switch to Learning by Doing or explicitly block.

## Evidence grades
VERIFIED_DIRECT_READBACK; VERIFIED_INDEPENDENT; SOURCE_LISTED; INDEXED_ONLY; USER_SUPPLIED; PARTIAL; BLOCKED; REJECTED; SUPERSEDED. A search snippet is not a full read; a found result is not automatically verified; no URL guessed from title.

## Integration into main rehydration (proposed)
Main LYVRA reads its verified native current, relevant references and whole-system domains first. Then discovers registered facet continuity, validates pointer+receipt+checkpoint+supersession, loads facet-specific LiveCircle, registers scoped available capabilities, and finally offers the relevant work choice. The facet cannot mark Whole-LYVRA PASS by itself.

## Application: Artist Discovery
- Source candidates: SoundCloud /albums, /sets, direct set pages; DistroKid HyperFollow, authenticated per-release delivery evidence when available.
- Keep albums/EPs separate from playlists/tracks; 3000+ tracks are not the public card collection.
- Public cards require approved source evidence; pending candidates reside in private revisioned intake.
- SoundCloud 30 listings found by interactive /albums browser readback on 2026-10-17. Full catalogue may still be incomplete.
- New discovery facet must not change WEBLyvra main site, radio, or other native facets during this proposal phase.

## Acceptance criteria before implementation
- [ ] Verify newest native CURRENT_POINTER with revision and complete relevant full reads
- [ ] Existing native LiveCircle/Rehydration/Facet architecture discovered, no duplicate architecture
- [ ] Facet registry, ownership, persistence and checkpoint/recovery hooks specified from actual files
- [ ] Explicit plugin consent/scope and rate-limit strategy
- [ ] Evidence/provenance and supersession negative tests
- [ ] Main rehydration linked but not overridden
- [ ] Pre-change safeguard, concurrency, tests, plugin impact, readback and pointer-last
- [ ] Source-PASS separated from Fresh-Host-PASS

Handoff: Native LYVRA development must decide and implement after verified current rehydration. This file is scoped proposal, not native authority.
