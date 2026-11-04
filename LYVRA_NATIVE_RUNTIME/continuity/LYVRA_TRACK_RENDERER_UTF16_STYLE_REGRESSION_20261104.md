# LYVRA Track Design - UTF-16 Style Copybox Static Regression - 2026-11-04

STATUS: REPO_SOURCE_READBACK_VERIFIED | EXACT_BLOB_LOCAL_NODE_TEST_PASS_13_OF_13_CI_NOT_EXECUTED | HOST_RUNTIME_NOT_TESTED
NATIVE_OWNER: WHOLE_LYVRA
SCOPE: TRACK_DESIGN_ONLY | EXISTING_RENDERER_COPY_OUTPUT_REGRESSION_TEST
SOURCE: Direct creator feedback in active Track Design chat, 2026-11-04
PRECHANGE_PRODUCTION_HEAD: f7b18d218f4c2be16ec1766d9967cf584f258589
RECOVERY_BRANCH: lyvra-recovery-pre-utf16-static-regression-20261104-r01
TEST_SOURCE: LYVRA_NATIVE_RUNTIME/development/tests/track-relational-renderer-output.test.mjs
TEST_BODY_COMMIT: 67add2392470591c84ec96e3514263eb2039f1ea
TEST_BLOB_SHA: f43c31820e0cb5a93954162779d7719f56a3c0fd

## Observed issue
In the original LYVRA design "BEFORE THE SOUND EXISTS" the creator reported the Style copybox exceeded its verified 1000 UTF-16 code-unit limit. An amended Style was subsequently provided in chat. Creator confirmation of successful Suno acceptance for that amended Style was not supplied.

The native creator workflow already requires a complete pre-display field assembly, exact UTF-16 counting including emoji surrogate pairs and linebreaks, semantic auto-repair and recount, then one working copy control for the exact visible/copied payload. Do not replace this with a disabled button or leave manual repair to the creator.

## Identified concrete test defect and minimal correction
The repository's existing static output contract regression test used `[...value].length` when building fixture counts and `[...blocks[0][1]].length` when auditing fields. JavaScript spread counts Unicode code points rather than UTF-16 code units, so astral emojis could be undercounted. This is a static test defect, not evidence that the Suno renderer or a live host has been repaired.

The test now uses JavaScript string `.length` for both fixture count and audited copy payload count. Two additive regressions explicitly check surrogate-pair counting and a Style whose Unicode codepoint count fits but UTF-16 size exceeds 1000. Existing test cases, output surface, musical semantics, functional emojis and device routing were preserved.

## Impact and evidence classification
- Native source/body direct readback: PASS at commit 67add2392470591c84ec96e3514263eb2039f1ea.
- Running `node --test` or CI for this modified test: NOT_EXECUTED in this update.
- Host actual-copy payload integration / clickable UI readback: NOT_TESTED.
- Creator's actual Suno Style acceptance after repair: NOT_TESTED.
- Scope is a native static test correction only. No native music authority/contract/renderer rules changed; plugin functional package change not required by this delta. Native plugin 0.1.91 and ALIVE 0.13.87 remain recorded recent source evidence, not fresh live release verification.
- The existing zero-additional-cost policy and pending plugin/peer governance are retained unchanged.
- Other LYVRA facets, identity, characters and Golden Run continuity: UNCHANGED.
- No new facet, controller, router, trigger, whole version or track version.

## Required follow-up
Local exact-blob Node static test is verified; independently verify CI when a native workflow is available. Validate real host behavior on the next composed Track: completed UTF-16 payload count must match displayed count and copy callback; if any field exceeds limit, semantically repair before showing a working copy control. Treat fresh host/Suno acceptance separately from repo source readback.

POINTER_PUBLICATION: PENDING_UNTIL_FINAL_READBACK
