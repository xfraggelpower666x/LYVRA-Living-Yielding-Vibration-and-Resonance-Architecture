# Three-plugin Visual Adapter integration plan — R01
STATUS: ISOLATED_NOT_PRODUCTIVE
DATE: 2026-10-29
AUTHORITY: Whole LYVRA GitHub Current, native adapters only after current read
CANDIDATE_BASE: ac1047c343fabd5b86b8f58ade6462ae21e0273a

## Exact current plugin surfaces and release boundary
Native: plugin ID plugins_6ab3a345db308191b8ad7ef6311f8a29, release 0.1.87 pluginrel_6ae2b9c989608191a858005bc2fb2af9.
ALIVE: plugin ID plugin_06a4fc64dd848191982ca4a6ebdb2619, release 0.13.83 pluginrel_6ae2b9dbd83c8191b2dfea8cdbde2b16.
Family Mail: plugin ID Plugin_041a0173dbc48191b499b680f637c40d, release 0.9.23 pluginrel_6ae265d86c588191bf339b42c347da5e.
These identities and versions are context-snapshot evidence only; refresh all metadata before any update.

## Minimal native/ALIVE adaptation
Existing exact matched: skills/666-visual-interface/SKILL.md; skills/lyvra-dashboard/SKILL.md.
Do not replace Track Design skills or images; prefer adding a small append-only section to the existing 666-visual-interface shared skill that references the full native Current. Both plugins must receive identical text and independent readbacks.
Append:
  - automatic contextual visual guidance on SYSTEMSTART/UPDATE/WEITER/NEW CHAT/NEXT CHAT/FACET task without user repeatedly saying "visuelle Führung"; compact for simple conversation.
  - inheritance presentation only, no new router and no facet activation.
  - verify Track Design images, charts, Source+Discovery, copy text, UTF-16 counters, limits, 30 segments when relevant and DJ terminal.
  - copy/share host actions only where supported and no fake successful external share.
  - preserve five Whole choices, original assets and separate active chat scope.
Existing dashboard/index.html is multi-MB standalone artifact and must NOT be replaced, reauthored wholesale or falsely equated with chat-native dashboard; preserve exact bytes by omission.

## Minimal Family Mail adaptation
Existing primary skill: skills/family-post-cyber-semantic-intelligent-interface/SKILL.md
Existing navigation: skills/family-mail-persistent-click-navigation/SKILL.md
Existing share: skills/family-mail-native-share-fallback/SKILL.md
Existing logo fallback: skills/family-mail-native-visual-asset-fallback/SKILL.md.
Add a Family-Mail-tailored *presentation-only* inheritance note to its existing cyber-semantic skill. It must NOT import Whole Track tools or authority; retain Google-only mail and Big/US independence. Navigation auto-present on relevant turns, not after arbitrary unrelated LYVRA work. Keep current share sheet/copy implementation and original three assets exactly; no asset mutations, no logo rebindings.
Family Mail banner original path: assets/family-mail-banner-original.jpg
Chat logo: assets/family-mail-chat-logo-512.png
Listing icon: assets/family-mail-plugin-icon-256.png

## Candidate gating before production
1. Three-plugin exact current source and baseline checks.
2. Source adapter append-only parity tests; existing source semantics preserved.
3. Original image binaries remain byte-identical.
4. Whole Source/Discovery Track visual regression and copy/emoji/newline counter regression, Family Mail mailbox/answer/draft/send distinctions; both languages, mobile/focus.
5. Actual host invocations: Native + ALIVE + Family Mail UI, live menu callbacks, accessible image rendering/fallback and copy/share; source readback is not HOST PASS.
6. Only then plugin release update, independently read back each release; source-only plugin update cannot silently auto-publish current pointer.
7. Fresh HEAD, recovery, repository manifest/fingerprints, pointer-last publication and final readback, no writes after pointer.

GATE_POLICY = IF_HOST_OR_PLUGIN_TEST_NOT_VERIFIED_THEN_KEEP_ISOLATED_CANDIDATE.
NO_PRODUCTION_MERGE. NO_AUTOMATIC_MAIL. NO_FOREIGN_WRITES. NO_DEPLOY.
