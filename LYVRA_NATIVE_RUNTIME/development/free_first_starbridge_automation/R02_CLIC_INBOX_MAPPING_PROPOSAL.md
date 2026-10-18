# R02 · CLIC-native Inbox mapping (LYVRA proposal only)

- OWNER: LYVRA Free-First development; StarBridge remains **666CLIC's native achievement**.
- This is a source-only compatibility preflight. It does **not** update CLIC `inbox/LYVRA/CURRENT.json`, create a CLIC receipt, trigger a workflow, or report Delivery/Adoption/Host PASS.
- The original LYVRA R02 source is unchanged. Existing CLIC `inbox/LYVRA/README.md` requires `CLIC_REPO_HANDOFF_V1` fields: handoff_id, source_system, source_repo, source_branch, source_head, created_at, affected_facets, relation_delta, analysis_request, supersedes and authority_transfer=false.
- `proposeClicInbox` constructs exactly that minimum *proposal*. The `source_head` must be the verified **published Git commit containing R02**, never the historical `source_base_head`.
- `verifyR02Source` reads injected authorized GitHub branch, pinned and live commit trees, then file content with recomputed Git SHA-1 blob hash and final branch freshness check. Missing connector, incomplete tree, modified blob, race or foreign ownership fail closed.
- The separate CLIC SB01–SB05 StarBridge envelope has fields such as `source_repository`, `source_path`, `status: PREPARED`; CLIC alone decides any native wrapping, receipt, sender/receiver binding or adoption. This mapping is not that envelope.
- Run tests: `node --test LYVRA_NATIVE_RUNTIME/development/free_first_starbridge_automation/r02-intake-compatibility.test.mjs`.
- Readonly/Zero-extra-cost: no CLIC writes, no Cloudflare deployment, no auto-transport, no scheduled GitHub workflow, no plugin or binary claims.
- Before a real CLIC-native intake, independently bind the source to a known commit and immutable blob and obtain CLIC-native authorization. SOURCE ≠ DELIVERY ≠ ADOPTION ≠ HOST.
