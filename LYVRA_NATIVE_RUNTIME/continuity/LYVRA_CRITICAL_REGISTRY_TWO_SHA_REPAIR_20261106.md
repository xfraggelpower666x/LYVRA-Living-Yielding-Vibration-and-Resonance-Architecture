# Whole LYVRA — Two stale critical carrier SHA bindings repaired

DATE: 2026-11-06
STATUS: LIVE_GITHUB_TREE_DIRECT_READBACK_VERIFIED_243_OF_243
SCOPE: REPOSITORY_CRITICAL_FRESHNESS_REGISTRY_ONLY
OWNER: WHOLE_LYVRA
RECOVERY_BRANCH: lyvra-recovery-pre-critical-registry-two-sha-repair-20261106-r01
PRECHANGE_HEAD: 701dee774e020e927273a64e491ef0833df3f8f2
REGISTRY_FIX_BODY_COMMIT: dbe29e87b6a0c68705daf2d39ac8385d6f618946
REGISTRY_BLOB: 692c19c12cfd55430d4d0876bf87db9951a8d462

## Direct observation, not simulation

At productive HEAD 701dee774e020e927273a64e491ef0833df3f8f2 the direct recursive GitHub tree was not truncated and contained 1865 entries. Direct read of the 243 critical-carrier path/SHA registry against the same tree yielded 241 exact matches, zero missing entries and precisely two mismatches:

| Actual current file | Previous stale expected blob | Direct current blob |
|---|---|---|
| `LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_RELATIONAL_CARD_INTELLIGENCE.md` | `4ec3f3f52acafb444e168f511ec4300a1573ad4e` | `636a35c826aed598ad63ac06dfa9aaa7896d32c1` |
| `LYVRA_NATIVE_RUNTIME/continuity/plugin_backup_circle/OUTBOUND_TO_PFS_COUPLED_BACKUP_CIRCLE_CURRENT.json` | `dece58a2b690fe16bf10c0fa3bca3a242501162b` | `f199717ce2d84d4fd9520bcba31ecdcf6455e2a0` |

The current Card blob already matches the newer valid Golden Run / relational co-player entry of the productive CURRENT pointer. The PFS handoff source indicates a newer plugin release set, no matching approval and no private backup execution. Neither carrier was rewritten, rebased or rolled back.

The registry was modified **only for those two SHA bindings**, with a scoped evidence entry and previous SHA provenance retained. GitHub's direct file readback returned the exact changed registry content and blob `692c19c12cfd55430d4d0876bf87db9951a8d462`.

## Reaudit

Immediately after the body write, a fresh recursive GitHub tree at HEAD `dbe29e87b6a0c68705daf2d39ac8385d6f618946` contained 1865 entries, nontruncated. Direct comparison of all 243 registered paths and Git blob SHAs produced:

- 243 exact matches of 243 registered critical carriers.
- Missing: 0.
- SHA mismatches: 0.
- Rehydration manifest, legacy history, current music source files and other critical blobs: not modified in this repair.
- This passes the **source-tree integrity gate** only; it is not fresh plugin host execution, full semantic rehydration, a Suno render, or a GitHub Actions CI run.

## Independent active plugin surfaces

Direct Plugin Creator backend metadata readback:
- Native: `plugins_6ab3a345db308191b8ad7ef6311f8a29`, version `0.1.91`, release `pluginrel_6ae9924655b48191a8fbc0dc8c2bae76`.
- ALIVE: `plugin_06a4fc64dd848191982ca4a6ebdb2619`, version `0.13.87`, release `pluginrel_6ae9926085408191827f459b20d8b76b`.

Readback of `skills/lyvra-track-capability-continuity/SKILL.md` inside **both actual current plugin releases** matched byte-for-byte as returned UTF-8 source text (6134 JavaScript string code units). Both refer to reading the productive GitHub Current, the three device routes, preservation of musical capability and separate host/runtime acceptance. Neither plugin package was modified. This is direct **selected-file source parity**, not full archive/binary parity or fresh host action.

## Actual remaining boundaries

- Independent Native/ALIVE fresh-host invocation: NOT_TESTED. Release identity and selected source parity do not imply it.
- Real Suno render / exact visible-to-copied host interaction: NOT_TESTED.
- The existing Track route source-level repair is published and registered; its new Node-test GitHub Actions result has not been independently retrieved.
- Analytics child migration remains a separate REVIEW requiring the complete owner/dual-plugin/host acceptance sequence; it is not created by this registry repair.
- PFS plugin backup approval remains **NOT_GRANTED**. The current LYVRA native approval receipt explicitly labels earlier approval historical/superseded. Full stable-set convergence and valid separate 666CLIC authorization remain unverified.
- Independent Windows RADIO WAVE `Infinity:NaN` investigation and real platform video export acceptance require original Windows source/executable/evidence. No Windows application files are mutated.

PROVENANCE_RULE = NEWER_VALID_CURRENT_NOT_OLD_CACHED_EXPECTATION
NO_FOREIGN_MUTATION = TRUE
NO_PLUGIN_MUTATION = TRUE
NO_NEW_COST = TRUE
NO_NEW_FACET_OR_CONTROLLER = TRUE
NO_VERSION_BUMP = TRUE
POINTER_LAST_REQUIRED = TRUE
