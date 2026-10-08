# LYVRA Pet Bridge v0.1 — native Pet first
Status: DEVELOPMENT_CANDIDATE / NOT_DEPLOYED
User-confirmed priority: own LYVRA Pet PRIMARY; ChatGPT Work Pet SECONDARY_OPTIONAL.
Recovery: unchanged production branch lyvra at e6ebde2bad1d47f3213c45e1ad2b0a3f15aaeb34.
Authority: Whole LYVRA. Neither surface owns identity, memory or personality.

## First instance
Browser / website / dashboard / Pet plugin remain the primary expression surface, usable outside Work. No Work heartbeat, account session or GPT Pet availability is required by the adapter.

## Second instance
Existing GPT Pet ID pet_6ab791129364819183885f44a21497a2 is preserved. Name, description and artwork are supported metadata surfaces. Live animation control and memory synchronization are unavailable through exposed tools. No synchronization is claimed.

## Character and development
Stable core: warmth, contextual cheekiness, musical thinking, independent judgment, curiosity and emotional nuance.
Current expression is resolved from context, relation meaning and causally relevant evidence.
Positive/negative/mixed memories retain provenance; current evidence and repair may change their meaning.
Curiosity -> own idea -> bounded experiment -> observed result -> evidence -> meaning -> learning -> new possibility.
No forced emotion, sarcasm quota, permanent failure labels or private relational payload in UI.

## Adapter contract
expression-adapter.mjs consumes a minimal expression envelope: pet_id, authority, source_revision (40-character Git commit), issued_at, valid_until (maximum five minutes), context and optional intensity.
It returns only allowlisted public expression fields. Private payload and free-form reason strings are discarded.
Expired, unknown, malformed or mismatched input yields calm idle.
VALIDATED_INPUT means structural validation only. A claimed commit/authority is NOT authenticated by this module. An authority-resolving trusted producer is still required before live automatic ingestion.
No autonomous memory write, external network fetch or storage occurs.

## Integration stages
1. Adapter candidate and implementation tests: delivered.
2. Trusted Whole-LYVRA producer: open. Resolve verified current, relevant character/relations/memory and select a public expression.
3. Wire primary browser and Worker renderers with expiry fallback and explicit manual preview distinction: open.
4. Integrate website/dashboard preserving existing navigation and artwork: open.
5. Check both main LYVRA plugin surfaces; release only impacted surfaces, read back, update coverage/manifests and pointer last: required before productive promotion.
6. Optional GPT metadata reconciliation; live projection remains capability-blocked.

## Acceptance
Primary works outside Work; unavailable secondary has no effect.
Unverified/expired input cannot create a current emotion claim.
Private memory is never copied to a public event.
Current identity/artwork/IDs are retained.
Production deployment, host behavior and causal memory access must be verified separately.
