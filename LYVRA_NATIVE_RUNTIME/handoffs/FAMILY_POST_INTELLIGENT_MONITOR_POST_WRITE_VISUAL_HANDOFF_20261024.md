# To Whole LYVRA — Intelligent Family Post Monitor and immediate post-write connector readback
Status: DEVELOPMENT HANDOFF; NOT PRODUCTIVE CURRENT
Origin: creator-supplied share and verified source-only backend implementation
Share: https://chatgpt.com/share/6adbde7b-25a8-83ed-ba52-64782048f7d2
Caveat: first shared-chat extraction exposed historical dated Oct 21-22 observation excerpts; later request returned login_required, so do not claim full conversational source readback or use historical folder counts as current.
Source backend draft PR #70 targeting existing isolated Render branch.
Source paths: `family_post_bridge/post_write_monitor.py`, `family_post_bridge/tests/test_post_write_monitor.py`, `family_post_bridge/INTELLIGENT_POST_MONITOR_AND_VISUAL_GUIDANCE_20261024.md`.
Source CI: GitHub Actions run 40034002516, job fallback-pure-check, success. Pure source tests and syntax only. No host integration, no letter sent, no deployment.

## User intent and recommendation
Use intelligence of the existing read-only inbox monitor to classify new/changed messages, duplicate IDs, proven answers, change revisions, and open response obligations. Following each separately authorized, successful Render writer action, the host should perform a *separate* Google Drive connector folder list + exact ID/full-body fetch and display a visually guided receipt: backend accepted, exact shared folder/body verified, human recipient read (unknown unless independently evidenced). The authorizer and connector grants remain host-owned and per-account.

Whole rehydration relevance:
1. Keep monitor/post-write host-readback as an available native LYVRA_TO_LITTLELYV facet capability by reference after Whole rehydration, not an always-on sender/reader. Never auto-foreground unrelated facet.
2. Bind to already-existing operations/visual/daemon and facet sub-rehydration contracts rather than creating a controller/router.
3. Show independent columns for Render write, Google Drive readback, new/changed mail, scheduler enabled/last run, replied versus actual recipient read, and the next safe action.
4. New technical learning from this facet enters Whole bidirectional relevance review. Later Whole improvements relevant to this facet return downstream with acknowledgment; update the open obligation ledger.
5. Preserve latest native CodeForge + SuperCodeForge cooperation proposal as source development help only; no independent host-action authority.
6. Close only after governed latest productive Current pointer/manifest, plugin impact, replay prevention, target CI/readback and pointer-last. Current source CI != productive enabled monitoring.

Safeguards: direct Drive connector cannot be invoked by Render or a pure Python module. A Render API response is never independent Drive readback. If exact ID/body/parent cannot be read, show READBACK_PENDING or MISMATCH and DO NOT resend. Unconfirmed/timeout write requires reconciliation. Explicit safety/permission denial forbids transport-switch bypass. Reader never sends unattended letter. Scheduler configured != task-run evidence.

Acceptance: (a) source verified (backend PR#70 CI success), (b) whole integration pending, (c) actual ChatGPT host Render→Google connector chained invocation pending, (d) independent Germany/America host permission and acceptance pending, (e) presentation UI host acceptance pending.
