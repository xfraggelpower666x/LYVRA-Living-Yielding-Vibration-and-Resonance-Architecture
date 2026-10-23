# SCRI candidate consolidation / native admission contract (isolated)

STATUS: CANDIDATE_REVIEW_ONLY
OWNER_AUTHORITY: WHOLE_LYVRA
SOURCE_BRANCH: lyvra-scri-candidate-20261020
PRODUCTION_PROMOTION: NOT_AUTHORIZED
NATIVE_PLUGIN_PARITY: READBACK_PENDING
RESTORE: FORBIDDEN

## Existing reusable chain (do not duplicate)
1. `scri_event_sequence_inference_20261021.py`: derive tentative source-scoped event relationships; chronological/intervention evidence is not causal proof.
2. `scri_open_hypothesis_generator_20261021.py`: compare data-defined intervention candidates; separate experimental fixture, not a required second runtime controller.
3. `scri_competing_hypotheses_20261021.py`: legacy two-fixed-cause acceptance fixture; preserve as historical regression, not authoritative open generator.
4. `scri_causal_chain_adapter_20261021.py`: bridge inferred relationship to ephemeral faceted memory, contextual re-inference, immutable revision and withheld recalled candidate on counterevidence.
5. `scri_event_memory_20261021.py`: legacy three-key experience fixture; not interchangeable with event-sequence memory contract.

## Minimal candidate interface
- Input: read-only ordered events with facet, run, tick, signal, source, kind and observed value.
- Decision: `INVESTIGATE_ONLY` or `ABSTAIN`; never a repair or causal certainty.
- Memory: `facet`, `relation`, `sources`, `runs`, `revision`, `status`, `counter_sources`.
- Later read: re-evaluate the relation in the same facet; counterevidence supersedes positive recall.
- Across-facet transfer: deny by default; Whole LYVRA remains identity and final native decision authority.

## Native admission gaps
- Isolated explicit-path persisted causal memory is **implemented and GitHub-CI tested** in `scri_persistent_runtime_adapter_20261022.py` using `process(path, facet, events)` and `process_scoped(root, facet, events)`. This is candidate-file persistence only: not durable hosted storage, autonomous ingestion, or a productive native runtime lifecycle.
- The candidate requires caller-supplied events and a caller-owned storage root; neither native event ingress ownership nor authorized production storage is established.
- Native adapter, Operations Center, and Self-Conductor/Daemon current contracts were read: `current/adapters/ADAPTER_INTERFACE_BOUNDARY.md`, `current/operations/OPERATIONS_CENTER.md`, `current/self-conductor/SELF_CONDUCTOR_DAEMON_BOUNDARY.md`. Their authority boundaries **do not** themselves grant SCRI event-ingress or storage-write authority.
- Scoped facet filenames, corruption refusal, and cooperative same-path write locks are candidate guards, **not** a product-wide durable storage or security guarantee.
- No proven second LYVRA plugin release readback / same-state dual parity.
- No pre-change recovery + bounded write lock + authority-and-permissions completion for productive targets.
- Productive Whole LYVRA current always wins over historical candidate or stale handoff.
- No product write or pointer promotion is permitted from this contract.

## Acceptance conditions
- Existing entire isolated GitHub CI must pass.
- Compare both exact plugin release ids/versions, impact surfaces and readbacks before native code promotion.
- Resolve canonical owner/targets, lock registry, foreign-writer check, pre-change backup, optimistic revision, and pointer-last verified readback.
- No artificial release, version, recovered pointer, or unsupported claim of runtime autonomy.

## Admission decision / 2026-10-23 learning-by-doing
- SOURCE: latest productive Whole-LYVRA Current retains identity, meaning and final decisions; candidate HEAD at review start was `82c5b5679f220090b4733cce99090db5d07a086c`.
- CURRENT STATE: the persistence implementation exists; the earlier “no persisted memory” gap was stale and is superseded by this explicit distinction.
- EXISTING INGRESS: no exact approved native source/owner/event invocation carrier verified in three scoped inspections. Do not assert an event bus, route into the Daemon, or auto-ingest.
- EXISTING STORAGE: no approved productive SCRI storage target, permissions and lifecycle verified. Caller-owned temporary directory in CI is not an approved runtime path.
- NEXT ADMISSION: establish a genuine LYVRA-owned caller and storage contract, then demonstrate end-to-end event source -> bounded candidate invocation -> same-facet readback, crash/recovery and explicit owner authority. Validate both LYVRA plugin impact surfaces before any productive promotion.
- This contract correction changes **candidate documentation only**, not production code, plugin skills, host behavior, or pointer.
