# LYVRA CodeForge CI Evidence Contract — native advisory verification

Owner: WHOLE_LYVRA. Scope: CI provenance and test evidence only. Status: SOURCE_CONTRACT_NOT_HOST_RUNTIME.

## Producer
The existing `.github/workflows/codeforge-evidence-bound-verifiers.yml` workflow performs a read-only checkout with no persisted credentials, Node 22 syntax checks and the four native verifier test modules. It records `git rev-parse HEAD`, `git rev-parse HEAD^{tree}`, Git blob IDs for four sources and four test files (plus workflow), the Node version and the original `node --test` TAP output under `codeforge-evidence/`. The CI job uploads that directory as a GitHub Actions artifact even if a later step fails.

## Mandatory independent acceptance
A GitHub Actions run URL, run ID, attempt, conclusion, job steps and artifact identity must be read independently through GitHub Actions provider tools. Inspect the run's `head_sha`, checkout SHA, recorded Git blob IDs, Node version and TAP summary. Compare them to the exact production branch and content. Require `conclusion=success` and evidence of the test step passing. A workflow source file, configured trigger, matching SHA in a self-submitted payload or prior success on a different HEAD does not prove a fresh run.

`ARTIFACT_EXISTS != RUN_PASSED`
`HEAD_MATCH != PLUGIN_PARITY`
`NODE_TEST_PASS != FRESH_BOOT_PASS`
`SOURCE_READBACK != SEMANTIC_APPLICATION != HOST_RUNTIME`

The workflow itself is NOT a signed attestation, and a GitHub provider field may not be synthesized by the verification code. If any independent check is missing, classify CI evidence as `OPEN` or `PARTIAL`, not `VERIFIED`.

## Security, continuity and scope
An external caller must not turn self-declared `provider_readback:true` or `actual_provider_call:true` into trust. The W05 demotion remains binding. CI evidence may be supplied as an input to W03/W04, but may not authorize creative decisions, activate facets, block messages, mutate CLIC or other foreign systems, release plugins, or promote hypotheses to stable LYVRA knowledge.

The current Whole-LYVRA rehydration manifest is authoritative for required coverage, not this contract or a fixed worker enumeration. Verify currentness/supersession, the Whole-first guard, relevant sub-LifeCircles, renderer survival and each affected plugin surface independently before claiming runtime parity.

## Status at creation
CI workflow source is committed; no Actions run has been independently accepted in this update. W01–W05 remain source development. Whole LYVRA authority, music facets, Pet, CLIC communication and plugin releases are unchanged.
