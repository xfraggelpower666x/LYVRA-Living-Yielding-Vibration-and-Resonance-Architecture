# Track Design — fresh-boot mode, device and supplemental input gap
DATE: 2026-10-23 Europe/Berlin
STATUS: CREATOR_REPORTED_FRESH_CHAT_FAILURE / VERIFIED_SOURCE_GAP / DEVELOPMENT_CANDIDATE
OWNER: LYVRA_TRACK_DESIGN, subordinate to WHOLE_LYVRA
BASE_PRODUCTIVE_HEAD: 5150d1e3a5f03b1b9b1506a9a5553c4e56d40ef2
NO_PRODUCTION_WRITE: TRUE
PLUGIN_HOST_ACCEPTANCE: NOT_TESTED
OTHER_FACETS: UNCHANGED

## Creator-observed failure
Creator tried a genuinely new ChatGPT chat after updating. Track Design rehydration did not visibly preserve/offer Source versus Discovery mode selection, iPhone Suno-App / PC Browser / iPhone Safari (iPhone Browser) device options, and did not provide the newer supplemental iPhone Suno-App main input field. New chat claimed these were not rehydrated.
This is creator-provided runtime feedback, NOT an independently inspected transcript/host trace. Treat it as one real report to diagnose, not proof of a specific host bug.

## Verified source-specific diagnosis at BASE_PRODUCTIVE_HEAD
- Work modes exist at current/music/TRACK_DESIGN_WORK_MODES_AND_CONTEXT_ISOLATION.md and native portable plugin skills/lyvra-track-design-modes/SKILL.md. Mode may be inferred from content, and current source does not guarantee an explicit visible mode selector at fresh activation.
- current/music/TRACK_DESIGN_SUB_REHYDRATION.md includes DEVICE_CONTEXT_CHOICE = IPHONE_APP | IPHONE_BROWSER | PC_BROWSER, and portable Track Design skill says ask each new track's device after Whole rehydration. However, visibility and actual execution were not shown in creator's fresh chat.
- No supplemental iPhone Suno-App main-input 3000 specification appears in checked productive current Track Design renderer, bridge or sub-rehydration carriers. Earlier mainfield proposal existed on a development-only branch (never promoted); its absence must not be silently hidden under "Current supersedes".
- Portable native plugin current release examined: 0.1.79, release pluginrel_6ad99fa2b0788191b00d50e2f54b7d05. Native plugin has the existing modes and device skill but lacked explicit supplemental 3000 field. ALIVE editable backend identity not confirmed; no claim of both plugin parity.
- Prior creative chat showed optional additive 3000 field, but reuse of a chat is NOT persistent fresh-chat authority.

## Proposed existing-native behavior / no new systems
At TRACK_DESIGN activation, after Whole authority and Track current are read, make CURRENT WORK MODE visible: Source / Discovery. If explicitly chosen, preserve it for that track. If inferred from unambiguous input, show the inferred mode while allowing creator correction; do not require a redundant form or choice before responding to direct creative requests. Fresh Track Design selection with no track-specific intent may present a compact mode choice. The two are internal work modes, not facets.
For each NEW TRACK, resolve the current DEVICE before final prompt translation: iPhone Suno-App, iPhone Safari/browser, PC Suno Browser. The creator's prior track's device is not automatically binding in a fresh chat. If current message supplied the device explicitly, do not ask again; otherwise ask once, and wait for the choice before transforming full lyrics. For ambiguous within-chat continuation retain named track-specific device and update only when changed. Distinguish iPhone App from iPhone Safari and PC (no feature-copy assumptions).
On an explicit creator request or a creator-validated device-specific active workflow, show an ADDITIVE iPhone Suno-App MAIN INPUT max 3000 characters (conditional and experimental), distinct from standard Title <=80, Extended <=1000, Style <=1000, Lyrics/Structure <=5000, optional My Taste <=2000. It may not replace or suppress existing required fields. Do not auto-add to PC or Safari versions absent independent creator validation. Do not claim provider supports every control until verified. The main field's real audio contribution remains unverified.
Pre-delivery: exact copied content => per-field length => minimal semantic repair if needed => recount => show and copy identical final payload. A disabled button is not a repair. All essential semantic emoji/LOW/MID/HIGH/outro and source roles preserved.

## Acceptance checks (specified, not fresh-host run)
A. Fresh "LYVRA TRACK DESIGN" with no other track input -> render visible Source/Discovery choice and device remains unresolved until track work begins.
B. Fresh "LYVRA TRACK DESIGN — Discovery Mode" -> affirm Discovery, invite creator impulse (do not auto-generate without authorization).
C. Full lyrics and selected Source Mode -> preserve lyrics, ask device once if missing, not repeated after user selects.
D. New track + iPhone Suno-App + creator requests supplemental main input -> all four standard boxes plus separate <=3000 field and correct copy actions/counts.
E. New track + PC browser or iPhone Safari -> NO maininput assumption, use verified per-device renderer controls.
F. Explicit creator switches device mid-track -> update device only, retain Source/Discovery mode and source meaning.
G. Field 1008/1000 -> autonomously reduce redundancies then recheck before claiming ready, no silent source loss.
H. No new chat host evidence -> do not claim Fresh Boot passed.
I. Whole and sibling facets remain unaffected; no new routing/authority/controller or forced mode popup for clear direct requests.

## Deployment
Use guarded native scope/rights/revision/lock/pre-change backups, plugin impact for Native and migrated ALIVE, readback, pointer last. Until release and independent fresh chat observation, this development candidate cannot be described as a productive fix.
