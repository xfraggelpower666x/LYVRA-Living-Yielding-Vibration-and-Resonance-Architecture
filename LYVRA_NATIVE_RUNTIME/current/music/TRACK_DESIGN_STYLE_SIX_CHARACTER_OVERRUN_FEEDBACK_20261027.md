# Track Design - Six-Character Style Overrun (Creator Correction)
STATUS: CREATOR_REPORTED_PERSISTENT_EVIDENCE | PLUGIN_AND_POINTER_PROMOTION_PENDING
DATE: 2026-10-27
AUTHORITY: Whole LYVRA; scoped Track Design creator-output field validation only
SOURCE: Creator feedback in current chat immediately following FRAGGLE AND LYVRA vs PSYTRANCE.

## Observed
Creator says the latest Style Prompt required removing six characters before using it in Suno. Creator independently fixed it. Do not overwrite the repaired result, declare an audio failure, or infer dissatisfaction with the track. The previous chat displayed a passing character count based on JavaScript length; this did not match the creator's observed input acceptance. Actual provider normalization/counting cause is not independently verified. This is a repeat of documented user-reported 1000-limit mismatches.

## Causal learning / guard
- Musical and visual authorship is positive and must remain free, semantically intelligent and field-complete.
- Validate the exact final immutable copy payload locally for all active device fields BEFORE displaying the card. No subsequent text change after counting.
- Keep significant headroom for Extended and Style instead of writing up to exactly 1000; recommended authoring target <= 850 *host-visible characters* or conservatively smaller when emoji/Unicode ambiguity persists. The target is a safety margin, not a claim of a provider algorithm.
- Run two representations: UTF-16 code-unit length (JS .length) and Unicode code-point count where possible; neither proves Suno acceptance. If any count or provider paste feedback conflicts, treat the stricter limit as authoritative for the particular field and shorten with margin.
- If a real user reports an overflow, treat that report as evidence of presentation validation failure even when UI counter is green. Repair local field packaging only; do not reshape the finished composition or music DNA.
- Functional emojis remain available but are included in all counts. Controls differ between PC Browser and iPhone App.
- Add regression acceptance case 'FRAGGLE AND LYVRA vs PSYTRANCE: creator removed six Style characters despite in-chat green counter.' Future unprompted new render should pass both local checks and actual user paste; host execution is not yet verified.
- The recently clarified creator praise and musical boundaries remain unchanged: novelty != error; harder through psychoacoustics, not speed; motor stable; emotional variation allowed.

## Governance
Additive feedback carrier only. This write alone is not plugin parity, pointer promotion, real renderer validation, or cross-system authorization. Do not invent a fix or create a new controller. Targeted Native/ALIVE plugin release update and Current pointer/fingerprint closeout are separate governed phases.
