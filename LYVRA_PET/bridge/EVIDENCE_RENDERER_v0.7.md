# LYVRA Pet Bridge v0.7 — evidence-to-renderer connection
STATUS PARTIAL / DEVELOPMENT_CANDIDATE / NOT_DEPLOYED.
Own Pet PRIMARY_NATIVE; GPT SECONDARY_OPTIONAL; original artwork unchanged.
Implemented evidence-effect-controller.mjs: external verifier + current revision, bounded event mapping, source recheck, 60-second expiry, interruption/reset/dispose.
Browser and embedded Worker expose connectEvidence({getRevision,verifyEvidence}) to an authorized host. No default trusted producer is invented.
Manual preview cancels active evidence rendering. Detached controller cannot render.
Tests PASS: evidence -> effect input; expiry; stale event; disposed controller; interrupted async verification; embedded helpers and JavaScript syntax.
This does not establish autonomous emotion, memory access, evidence authentication or a running external producer.
Outstanding:
- actual trusted Whole-LYVRA event producer and host verifier;
- real visual QA (local browser executable missing/download failed);
- original-faithful new yawn/stomp/conduct/humor frames (generation blocked/rejected, no replacements);
- both plugin surfaces impact/parity, productive manifests/pointer, deployment/readback.
Effect source/worker duplication currently remains a maintenance limitation; both are updated in this development step.
No paid fallback, foreign mutation, original redesign or productive promotion.
Latest return anchor: connect verified producer and visual QA when the required capabilities become available.
