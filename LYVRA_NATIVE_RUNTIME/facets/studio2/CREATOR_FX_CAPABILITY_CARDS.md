# LYVRA Studio 2 — Creator FX Capability Cards

STATUS: CURRENT_CREATOR_REFERENCE_TRANSLATION
DATE: 2026-10-07
OWNER_IDENTITY: LYVRA
SOURCE_CLASS: USER_SUPPLIED_SCREENSHOTS_AND_CREATOR_REFERENCE_PACK
REFERENCE_REGISTRY: LYVRA_NATIVE_RUNTIME/music/MUSIC_REFERENCE_REGISTRY_2026-10-05.json

## Global guards

SCREENSHOT_REFERENCE_NE_AUDIO_PASS = true
PLUGIN_EXISTENCE_NE_AUDIO_BEHAVIOR_PASS = true
PLUGIN_NAME_NE_UNLIMITED_CAPABILITY = true
UNKNOWN_CONTROL_NE_INVENTED_CONTROL = true
USE_MINIMUM_CAUSALLY_USEFUL_CHAIN = true
LOW_END_MONO_PROTECTION_REQUIRED = true
MASTER_CLOCK_DRIFT_FORBIDDEN = true

Capability cards translate preserved creator references into operational Studio 2 knowledge.
They do not claim undocumented parameter ranges or real audio behavior that has not been validated.

## Psy Foundation

FAMILY: FOUNDATION / LOW-END
PRIMARY_TARGET: dry kick + rolling-bass foundation stability
SIGNAL_SCOPE: kick | bass | low-end bus
BEST_SECTIONS: intro entry | build support | drop | peak | repair
PRESERVE: kick transient | mono sub | short 16th rolling-bass definition | rigid master clock
MUTATE: firmness | controlled weight | low-end coherence
CHAIN_POSITION: early low-end
SAFE_PAIRINGS: optional LYVRA DNA — Signal Pressure after foundation
LIMITS_AVOID: stereo low-end expansion | tail smear | transient softening
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## LYVRA DNA — Signal Pressure

FAMILY: MULTIBAND PRESSURE / DNA
PRIMARY_TARGET: LOW/MID/HIGH pressure relation
SIGNAL_SCOPE: motor + responsive mids + high psychoacoustic field
BEST_SECTIONS: build | drop | peak | transition
PRESERVE: protected mono low-end motor | kick/bass authority | forward traction
MUTATE: responsive Acid/FM mids | spectral pressure | orbital high movement
CHAIN_POSITION: post-foundation or contextual bus
SAFE_PAIRINGS: Psy Foundation | Psy Grid/Pulse | Psy Orbit when causally required
LIMITS_AVOID: motor replacement | uncontrolled low widening
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Psy Pulse

FAMILY: GRID / RHYTHM
PRIMARY_TARGET: rhythmic mutation and pulse
SIGNAL_SCOPE: percussion | mid-rhythm | transient motion
BEST_SECTIONS: build | drop | peak | transition
PRESERVE: 4/4 kick | rolling bass | master clock
MUTATE: pulse density | coded movement | accent behavior
CHAIN_POSITION: rhythmic mid layer
SAFE_PAIRINGS: Psy Grid | Night Canopy | Psy Orbit
LIMITS_AVOID: swing drift | timing instability | motor replacement
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Psy Grid

FAMILY: GRID / RHYTHM
PRIMARY_TARGET: step-grid and coded movement
SIGNAL_SCOPE: mid | percussion | FX gating
BEST_SECTIONS: build | drop | breakdown return | peak
PRESERVE: rigid DJ grid | kick/bass alignment
MUTATE: step placement | rhythmic gating | mechanical micro-patterning
CHAIN_POSITION: rhythm/mid
SAFE_PAIRINGS: Psy Pulse | Psy Spiral
LIMITS_AVOID: BPM change | low-end timing destabilization
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Night Canopy

FAMILY: FOREST / RITUAL / SPACE
PRIMARY_TARGET: dark forest and ritual scene motion
SIGNAL_SCOPE: mid-high | atmosphere | percussive texture
BEST_SECTIONS: intro | breakdown | build | consequence
PRESERVE: low-end motor beneath the scene
MUTATE: forest texture | ritual motion | organic-dark spatial density
CHAIN_POSITION: scene layer above motor
SAFE_PAIRINGS: Psy Grid/Pulse | Psy Spiral | Void Gravity
LIMITS_AVOID: kick/bass masking | ambient drift replacing propulsion
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Psy Spiral

FAMILY: DELAY / MOTION
PRIMARY_TARGET: call-response delay and spiral temporal motion
SIGNAL_SCOPE: acid | vocal fragments | mid FX | high FX
BEST_SECTIONS: transition | breakdown | build | consequence
PRESERVE: foreground lyric intelligibility | low-end clarity
MUTATE: echo path | rotational response | temporal perception
CHAIN_POSITION: post-source motion effect
SAFE_PAIRINGS: Psy Orbit | Night Canopy | selected vocal/acid objects
LIMITS_AVOID: sub smear | permanent wash | mantra obscuration
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Psy Orbit

FAMILY: SPACE / MOTION / PSYCHOACOUSTICS
PRIMARY_TARGET: orbital psychoacoustic movement
SIGNAL_SCOPE: high | mid-high | atmosphere | selected audio
BEST_SECTIONS: build | breakdown | peak | consequence
PRESERVE: mono low-end | motor certainty
MUTATE: perceived distance | proximity | orbit | stereo perception | spectral motion
CHAIN_POSITION: psychoacoustic spatial layer
SAFE_PAIRINGS: Psy Spiral | Void Gravity | Night Canopy
LIMITS_AVOID: low-end stereo destabilization | static decorative width
CAUSAL_RULE: movement must be audible and tied to section meaning
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## VOID GRAVITY

FAMILY: DARK SPACE / VOID
PRIMARY_TARGET: void depth, gravity, suction, proximity/distance
SIGNAL_SCOPE: atmosphere | high | transition objects
BEST_SECTIONS: intro | breakdown | pre-drop | consequence | outro
PRESERVE: timebase certainty | drop anchor | low-end motor
MUTATE: depth | suction | gravity | dark spatial pressure
CHAIN_POSITION: spatial/depth layer
SAFE_PAIRINGS: Psy Orbit | Night Canopy | Kaleido Freeze
LIMITS_AVOID: kinetic tension removal | over-washing the mix
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Kaleido Freeze

FAMILY: MEMORY / FREEZE / TRANSFORMATION
PRIMARY_TARGET: freeze/granular-like memory transformation
SIGNAL_SCOPE: selected audio | vocal fragment | FX object | transition object
BEST_SECTIONS: breakdown | transition | pre-drop | consequence
PRESERVE: source recognizability when memory relation matters | motor outside selected object
MUTATE: frozen texture | fragmented memory | time-perception | spectral residue
CHAIN_POSITION: object-specific transformation
SAFE_PAIRINGS: Psy Spiral | Psy Orbit | Void Gravity
LIMITS_AVOID: whole-mix freezing by default | invented granular controls | masking next drop
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## LYVRA DNA — Signature

FAMILY: IDENTITY / FINISH
PRIMARY_TARGET: identity glue and finishing relation
SIGNAL_SCOPE: contextual bus or selected layers
BEST_SECTIONS: final balancing | drop/peak coherence | consequence
PRESERVE: transient impact | mono sub stability | stereo clarity | macro-dynamics
MUTATE: cohesion | signature relation | perceptual finish
CHAIN_POSITION: late/contextual, never automatic
SAFE_PAIRINGS: only after signal-specific problems are solved
LIMITS_AVOID: master-effect-as-fix-all | flattening dynamics | masking causal layer roles
EVIDENCE_STATUS: CREATOR_REFERENCE_MAPPED
REAL_AUDIO_VALIDATION_STATUS: OPEN

## Additional creator-derived plugin archetypes

These are design/reference archetypes, not proof of installed or validated runtime behavior.

- Psy Orbit Width → Space / Motion
- Ritual Kick Filter → Rhythm / transient-reactive
- Abyss Spiral Delay → Delay / motion
- Sub Forge Saturator → Bass character
- Crystal Venom → Lead / Acid exciter
- Forest Build Driver → Build / Transition

STATUS: REFERENCE_ARCHETYPE_ONLY
PROMOTION_REQUIRES: identifiable plugin evidence + actual Studio 2 behavior validation

## Routing

SIGNAL > PROBLEM_OR_GOAL > SECTION > FACET > PRESERVE_MUTATE > MINIMUM_USEFUL_CHAIN > EXECUTE > LISTEN > CLASSIFY

Motor problems are repaired before decorative high-layer effects.
Psychoacoustic effects may be intense, but may not destabilize the master clock or protected mono low-end.


## Execution semantics — 2026-10-07

THIS_FILE_NE_FIXED_MATRIX = true
CARDS_ARE_OPEN_RELATIONAL_EVIDENCE = true
CARD_SELECTION_NE_MANDATORY_CHAIN = true
LYVRA_MAY_COMBINE_IGNORE_OR_EVOLVE_CARDS_CONTEXTUALLY = true

For each selected plugin:
- inspect only controls actually exposed by the current Studio 2/plugin surface,
- set starting values directly when supported,
- use built-in automatic modulation/self-regulation only when exposed and causally useful,
- use Automation Lane for parameter movement that must change over time,
- preserve protected LOW, master clock, vocal intelligibility and section intent,
- keep only changes that produce a confirmed improvement.

MANUAL_USER_PARAMETER_RIDING_NE_DEFAULT = true
UNKNOWN_CONTROL_REMAINS_OPEN = true
UNVERIFIED_AUTOMATION_BEHAVIOR_REMAINS_OPEN = true
