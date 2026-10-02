"""Suno Speech output PRE-FLIGHT only. Native LYVRA decides all creative meaning.

This is not a renderer, identity, routing, or automatic phonemic-repair
engine. It validates user-visible fields against a selected UI mode.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal
import re

SpeechMode = Literal["einfach", "erweitert"]
VoiceSex = Literal["männlich", "weiblich", "unbekannt"]
MusicSetting = Literal["an", "aus", "unbekannt"]

# Unicode ranges broadly covering emoji/pictograms. A heuristic warning/gate,
# not proof of Suno's treatment of any glyph or phoneme.
GLYPH_PATTERN = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF]")


@dataclass(frozen=True)
class SpeechDraft:
    mode: SpeechMode
    freeform: str = ""
    script: str = ""
    tonfall: str = ""
    voice_sex: VoiceSex = "unbekannt"
    background_music: MusicSetting = "unbekannt"
    variety: str = ""
    # Explicit creator-approved experiment; user original must be separately kept.
    experiment_literal_script_emoji: bool = False
    # Optional, creator-confirmed CURRENT UI counters; no permanent default.
    observed_limits: dict[str, int] = field(default_factory=dict)


@dataclass(frozen=True)
class PreflightResult:
    errors: tuple[str, ...]
    notes: tuple[str, ...]

    @property
    def ready(self) -> bool:
        return not self.errors


def inspect(draft: SpeechDraft) -> PreflightResult:
    errors: list[str] = []
    notes: list[str] = []
    if draft.mode not in ("einfach", "erweitert"):
        errors.append("Unknown Speech interface mode")
        return PreflightResult(tuple(errors), tuple(notes))
    if draft.voice_sex not in ("männlich", "weiblich", "unbekannt"):
        errors.append("Stimmgeschlecht selection not recognized")
    if draft.background_music not in ("an", "aus", "unbekannt"):
        errors.append("Hintergrundmusik selection not recognized")

    if draft.mode == "einfach":
        if not draft.freeform.strip():
            errors.append("Einfach needs the visible freeform idea")
        if draft.script.strip() or draft.tonfall.strip():
            errors.append("Einfach must not pretend extra Skript/Tonfall fields exist")
        if draft.variety.strip() or draft.voice_sex != "unbekannt" or draft.background_music != "unbekannt":
            errors.append("Einfach controls not verified; do not copy Erweitert controls")
    else:
        if draft.freeform.strip():
            errors.append("Erweitert screenshot does not establish another Hauptfeld")
        if not draft.script.strip():
            errors.append("Erweitert requires exact intended spoken Skript")
        if not draft.tonfall.strip():
            errors.append("Erweitert requires separate Tonfall")
        if draft.background_music == "unbekannt":
            notes.append("Hintergrundmusik value unknown; creator must choose")
        if draft.voice_sex == "unbekannt":
            notes.append("Stimmgeschlecht value unknown; creator must choose")
        if not draft.variety.strip():
            notes.append("Vielfalt slider value not provided; do not guess numeric value")
        if GLYPH_PATTERN.search(draft.script):
            if not draft.experiment_literal_script_emoji:
                errors.append("Literal emoji in spoken Skript requires explicit experimental opt-in")
            else:
                notes.append("Experimental literal emoji: Suno may speak or mishandle glyphs; A/B needed")
    for field_name, limit in draft.observed_limits.items():
        if field_name not in ("freeform", "script", "tonfall") or type(limit) is not int or limit < 1:
            errors.append("Invalid creator-confirmed UI limit")
            continue
        if len(getattr(draft, field_name)) > limit:
            errors.append(f"{field_name} exceeds observed active UI limit {limit}")
    notes.append("No audible pronunciation or renderer result is proven by this preflight")
    return PreflightResult(tuple(errors), tuple(notes))


def _parse_timecode(timecode: str) -> float:
    """Validate MM:SS or HH:MM:SS (optional decimal seconds)."""
    parts = timecode.strip().split(":")
    if len(parts) not in (2, 3):
        raise ValueError("Timecode must be MM:SS or HH:MM:SS")
    try:
        if len(parts) == 2:
            minutes, seconds = int(parts[0]), float(parts[1])
            hours = 0
        else:
            hours, minutes, seconds = int(parts[0]), int(parts[1]), float(parts[2])
        if (min(hours, minutes, seconds) < 0 or seconds >= 60
                or (len(parts) == 3 and minutes >= 60)
                or not __import__("math").isfinite(seconds)):
            raise ValueError("Invalid timecode range")
        return hours * 3600 + minutes * 60 + seconds
    except (TypeError, ValueError, OverflowError) as exc:
        raise ValueError("Invalid timecode syntax") from exc


def phoneme_candidate(original: str, proposed: str, *,
                      verified_timecode: str = "", creator_approved: bool = False,
                      audio_ref: str = "", audio_duration_seconds: float = 0.0,
                      heard_observation: str = "",
                      original_script_matched: bool = False) -> tuple[str, str]:
    """Return a NON-DESTRUCTIVE pronunciation test candidate.

    The human review metadata is a prerequisite, but the function does not
    listen to or verify audio itself. It MUST NOT be described as audio PASS.
    """
    import math

    if not isinstance(original, str) or not isinstance(proposed, str):
        raise ValueError("Original and proposed text are required")
    if not original.strip() or not proposed.strip():
        raise ValueError("Original and proposed spoken words both required")
    seconds = _parse_timecode(verified_timecode)
    if (not isinstance(audio_ref, str) or not audio_ref.strip()
            or not isinstance(heard_observation, str)
            or len(heard_observation.strip()) < 8):
        raise ValueError("Specific audio version and concrete heard observation required")
    if (type(audio_duration_seconds) not in (float, int)
            or not math.isfinite(audio_duration_seconds)
            or audio_duration_seconds <= 0
            or seconds > audio_duration_seconds):
        raise ValueError("Timecode must fall within this actual audio asset")
    if original_script_matched is not True:
        raise ValueError("Exact original spoken-script version not confirmed")
    if creator_approved is not True:
        raise PermissionError("Creator approval required for a phonemic substitute")
    return (original, proposed)
