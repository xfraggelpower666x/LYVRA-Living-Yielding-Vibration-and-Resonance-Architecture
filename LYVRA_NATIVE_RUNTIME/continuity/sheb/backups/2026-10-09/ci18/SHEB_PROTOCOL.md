# LYVRA Semantic Handoff & Evidence Bus — SHEB
STATUS: DEV_CANDIDATE; NOT PRODUCTIVE; WHOLE_LYVRA_AUTHORITY_ONLY
ROLE: compatibility layer over existing native workspace / Track Design / Studio 2 / Analytics / Guidance / plugin handoffs.
NO_NEW_SYSTEM=true; NO_GLOBAL_ACTIVE_WORKSPACE=true; NO_FOREIGN_AUTO_MUTATION=true.
One message carries handoff_id, lineage_id, version, sender, receiver, workspace_id, source_revision, provenance, causal_reason, evidence_refs, dependencies, risks, expected_effect, created_at.
Validation is independent of adoption. State ladder: PROPOSED -> SENT -> RECEIVED -> VERIFIED -> EVALUATED -> ADOPTED or REJECTED -> APPLIED -> READBACK_PASS. Failed writes yield WRITE_BLOCKED, not a receipt.
Each receipt binds exact handoff ID, version, source revision and receiving facade; delivery != evaluation != integration != verified production outcome.
Sender must not claim an external recipient received an item without recipient readback.
Unique handoff id+version dedup, supersession confined to same workspace/lineage, conflicting source revision quarantined.
Native SYSTEMSTART reads Current then relevant inbox. UPDATE evaluates within authorized workspace. WEITER resumes pending operations. NEW CHAT/NEXT CHAT preserve current chat lineage. AUDIT read-only.
Skill proposal: lyvra-semantic-handoff, same contract in both LYVRA plugin surfaces, distinct permissions and fingerprints, no plugin ownership of Whole Authority.
Initial pilot: existing Track Design / Studio 2 continuity handoff; name LYVRA Studio 2 with legacy LYVRA SUNO STUDIO 2 alias. Analysis and rename proposal require explicit recipient verification and adoption.
Current dev implementation is schema validation and a dry-run receipt classifier only. It does not deliver over an external channel.
