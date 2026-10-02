# LYVRA Speech Design — creator two-WAV acoustic review
DATE=2026-10-02
STATUS=DEV_OFFLINE_WAVEFORM_MEASUREMENTS_ONLY_WORD_FAULTS_UNVERIFIED
PR=https://github.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/pull/23
PRIVACY=RAW_CREATOR_AUDIO_LOCAL_ONLY_NOT_UPLOADED_TO_GITHUB

## Original upload identity
### Version 1
Filename: `The Fraggle Dynasty [0m00s-6m31s].wav`
SHA256: `a5b64fa641a6fec01bf82edbc2e43f83d186960df2b9c7145a341ad75a294967`
Duration: 391.473 seconds; 48000 Hz, stereo, signed 16-bit PCM.
10-second whole-mix windows: 40.
First 0–10s: RMS −20.61 dBFS, sample peak −1.66 dBFS.
Final 390–391.473s: RMS −28.57 dBFS, sample peak −14.33 dBFS.

### Version 2
Filename: `The Fraggle Dynasty [0m00s-6m34s].wav`
SHA256: `979077c3d2371493c4689643deb198507b8801a813a2c988ac9728511a95d3c8`
Duration: 393.917 seconds; 48000 Hz, stereo, signed 16-bit PCM.
10-second whole-mix windows: 40.
First 0–10s: RMS −22.20 dBFS, sample peak −4.63 dBFS.
Final 390–393.917s: RMS −22.81 dBFS, sample peak −5.77 dBFS.

Data was computed by offline PCM read of two user-provided WAVs.
Two separate local-only review artifacts exist in the producer session:
`LYVRA_SPEECH_WAV_REVIEW_INDEX_2026-10-02.json` (full 40-bin
per file metadata) and `LYVRA_SPEECH_WAV_REVIEW_TIMELINE_2026-10-02.csv`
(80 empty review slots for timecode, source word, heard fault, producer
confidence). Neither source WAV nor a guessed transcription is in Git.
Timestamps and decibel summaries are WHOLE stereo mixes; backing
music may fully mask a voice and cannot be treated as intelligibility
or evidence of which consonant was lost.

## Continued acceptance
- Determine which original `666.md` spoken script/emoji variant produced
  each specific WAV before attempting forced transcript or phonemic edit.
- Listen to version-specific timecoded short passages; log source word,
  heard vs intended syllables, consonant endings, uncertainty, and any
  music masking. No automatic `LYVRA` phonetic respelling on guesses.
- New `speech_output_preflight.py` enforces real bounded timecodes,
  audio version identity, hearing observation, source-version match
  and creator approval for NON-DESTRUCTIVE candidate substitutions.
  This is validation of user-entered evidence, not proof of actual listening.
- Latest GitHub Actions success:
  https://github.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/actions/runs/37005778013
  26/26 offline unittest PASS, syntax PASS, executable source commit
  `d60dc2de30875a3cc22baf0656686d89822c3db8`.
- Native whole state and target plugins remain unchanged, PR DRAFT.
  Future Suno audio render A/B, current protected native rehydration,
  plugin Skill release and GPT Builder work remain separate.
