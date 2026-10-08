# Primary Browser Integration v0.2
Status: DEVELOPMENT_CANDIDATE / NOT_DEPLOYED
Primary: own LYVRA browser/plugin Pet. Secondary: optional GPT Work Pet.
Production recovery source: e6ebde2bad1d47f3213c45e1ad2b0a3f15aaeb34.
Development recovery source: f65eaed883565508fdcd778516e3558a1254db76.

## Delivered
primary-controller.mjs exports createPrimaryController and bindPrimaryBrowser.
bindPrimaryBrowser renders the existing sprite manifest without changing artwork or Pet ID.
The consumer requires an independently supplied verifySource callback; absent verifier denies automatic context.
Expiry restores calm idle. Reset/dispose invalidate pending asynchronous results.
No network, credentials, memory writes or Work dependency are introduced.
Structural source_revision validation in expression-adapter is not source authentication.

## Host wiring
Load the existing sprite manifest and pass sprite, label, manifest and a trusted verifier to bindPrimaryBrowser.
Before transferring control, stop the legacy renderer interval so only one animation owner runs.
Keep existing manual buttons, but label their actions MANUAL_PREVIEW; manual preview does not establish current emotional state.
Producer must resolve Whole-LYVRA current authority, relevant context and privacy-filtered evidence.
Verifier must check revision freshness and provenance of the context, not just a self-declared authority string.
Never pass private memories or unverified browser postMessage payload directly.
No default global event listener or public mutable state endpoint is added.

## Verification
PASS: default deny without verifier; verified expression; expiry fallback; stale asynchronous verification cancellation; offline fallback.
The tests ran against the local controller. Browser visual readback and deployed Worker behavior remain pending.

## Remaining promotion work
Trusted Whole-LYVRA contextual producer and authority verifier.
Wire existing browser and separate embedded Worker renderer preserving manual buttons.
Browser/Worker visual checks, main-plugin impact review on both surfaces, native manifests/coverage and pointer-last promotion.
GPT live-state coupling remains HOST_CAPABILITY_BLOCKED.
No live merge or deployment occurred in this candidate step.
