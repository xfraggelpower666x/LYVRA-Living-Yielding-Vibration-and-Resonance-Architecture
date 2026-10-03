"""Strictly offline tests for Speech beta creator-facing output.
No Suno/network/plugin calls and no native authority mutations.
"""
import importlib.util
from pathlib import Path
import unittest

BASE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "speech_output_preflight", BASE / "tools" / "speech_output_preflight.py")
import sys
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
SpeechDraft = module.SpeechDraft
inspect = module.inspect
phoneme_candidate = module.phoneme_candidate


class ModeTests(unittest.TestCase):
    def test_simple_valid_freeform(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="Eine emotionale Rede 💜"))
        self.assertTrue(r.ready)

    def test_simple_without_prompt_denied(self):
        self.assertFalse(inspect(SpeechDraft(mode="einfach")).ready)

    def test_simple_cannot_invent_script_panel(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="idea", script="not displayed"))
        self.assertFalse(r.ready)

    def test_simple_cannot_invent_slider(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="idea", variety="Normal"))
        self.assertFalse(r.ready)

    def test_advanced_correct_controls(self):
        r = inspect(SpeechDraft(mode="erweitert", script="Every dynasty begins.",
            tonfall="Speak with warmth.", voice_sex="männlich",
            background_music="an", variety="Normal"))
        self.assertTrue(r.ready)

    def test_advanced_missing_script(self):
        r = inspect(SpeechDraft(mode="erweitert", tonfall="Narrate"))
        self.assertFalse(r.ready)

    def test_advanced_missing_tonfall(self):
        r = inspect(SpeechDraft(mode="erweitert", script="Hello"))
        self.assertFalse(r.ready)

    def test_advanced_extra_main_denied(self):
        r = inspect(SpeechDraft(mode="erweitert", freeform="old prompt",
                                script="Hello", tonfall="Warm"))
        self.assertFalse(r.ready)

    def test_no_fixed_2800_global_cap(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="A" * 3000))
        self.assertTrue(r.ready)

    def test_observed_ui_caps_are_optional(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="abc",
                                observed_limits={"freeform": 2}))
        self.assertFalse(r.ready)

    def test_limit_schema_rejects_str_and_unrelated_controls(self):
        for spec in [{"freeform": "2800"}, {"variety": 80}, {"script": -1}]:
            with self.subTest(spec=spec):
                self.assertFalse(inspect(SpeechDraft(mode="einfach",
                    freeform="OK", observed_limits=spec)).ready)

    def test_adv_unknown_options_are_disclosed(self):
        r = inspect(SpeechDraft(mode="erweitert", script="One",
                                tonfall="Clear"))
        self.assertTrue(r.ready)
        self.assertTrue(any("Stimmgeschlecht" in n for n in r.notes))
        self.assertTrue(any("Vielfalt" in n for n in r.notes))


class EmojiAndPhonemeTests(unittest.TestCase):
    def test_script_emoji_blocked_by_default(self):
        r = inspect(SpeechDraft(mode="erweitert",
                  script="💜 Our family.", tonfall="Warm"))
        self.assertFalse(r.ready)

    def test_script_emoji_explicit_optin_and_warning(self):
        r = inspect(SpeechDraft(mode="erweitert", script="💜 Our family.",
                  tonfall="Warm", experiment_literal_script_emoji=True,
                  reference_script="Our family."))
        self.assertTrue(r.ready)
        self.assertTrue(any("A/B" in n for n in r.notes))

    def test_tonfall_emoji_can_be_contextual_hypothesis(self):
        r = inspect(SpeechDraft(mode="erweitert", script="Our family.",
                  tonfall="💜 Speak with affection."))
        self.assertTrue(r.ready)

    def test_no_audio_pass_claim(self):
        r = inspect(SpeechDraft(mode="einfach", freeform="Warm speech"))
        self.assertTrue(any("No audible" in n for n in r.notes))

    def test_phoneme_requires_verified_timecode(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("LYVRA", "Lai-vra", creator_approved=True)

    def test_phoneme_requires_creator_approval(self):
        with self.assertRaises(PermissionError):
            phoneme_candidate("LYVRA", "Lai-vra", verified_timecode="02:14",
                audio_ref="render_v1.wav", audio_duration_seconds=391.473,
                heard_observation="The narrator reads the name differently",
                original_script_matched=True)

    def test_approved_candidate_does_not_change_origin(self):
        source="LYVRA"
        result=phoneme_candidate(source, "Lai-vra",
            verified_timecode="02:14", creator_approved=True,
            audio_ref="render_v1.wav", audio_duration_seconds=391.473,
            heard_observation="Name pronounced with an unintended vowel",
            original_script_matched=True)
        self.assertEqual(result, ("LYVRA", "Lai-vra"))
        self.assertEqual(source, "LYVRA")

    def test_invalid_timecode_rejected(self):
        for mark in ("about two", "2:60", "bad", "-1:40", "1:NaN", "1:inf", "2"):
            with self.subTest(mark=mark), self.assertRaises(ValueError):
                phoneme_candidate("LYVRA", "Lai-vra",
                    verified_timecode=mark, creator_approved=True,
                    audio_ref="render_v1.wav", audio_duration_seconds=391.473,
                    heard_observation="Name mispronounced at this moment",
                    original_script_matched=True)

    def test_timestamp_must_be_inside_this_render(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("LYVRA", "Lai-vra",
                verified_timecode="06:35", creator_approved=True,
                audio_ref="render_v1.wav", audio_duration_seconds=391.473,
                heard_observation="Name mispronounced in recorded audio",
                original_script_matched=True)

    def test_requires_exact_asset_identity(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("LYVRA", "Lai-vra",
                verified_timecode="02:14", creator_approved=True,
                audio_ref="", audio_duration_seconds=391.473,
                heard_observation="Name pronounced unexpectedly in playback",
                original_script_matched=True)

    def test_requires_concrete_heard_observation(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("LYVRA", "Lai-vra",
                verified_timecode="02:14", creator_approved=True,
                audio_ref="render_v1.wav", audio_duration_seconds=391.473,
                heard_observation="bad",
                original_script_matched=True)

    def test_source_version_must_match(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("LYVRA", "Lai-vra",
                verified_timecode="02:14", creator_approved=True,
                audio_ref="render_v2.wav", audio_duration_seconds=393.917,
                heard_observation="Name pronounced unexpectedly in the recording",
                original_script_matched=False)

    def test_hh_mm_ss_decimal_timecode_supported(self):
        result=phoneme_candidate("LYVRA", "Lai-vra",
            verified_timecode="00:02:14.250", creator_approved=True,
            audio_ref="render_v2.wav", audio_duration_seconds=393.917,
            heard_observation="Unintended vowel sound in the spoken name",
            original_script_matched=True)
        self.assertEqual(result, ("LYVRA", "Lai-vra"))

    def test_empty_alternative_denied(self):
        with self.assertRaises(ValueError):
            phoneme_candidate("Fraggle", " ", verified_timecode="01:00",
                              creator_approved=True)


    def test_utf16_surrogate_pairs_exceed_observed_limit(self):
        self.assertEqual(module.ui_utf16_length("❤️⚡💜"), 5)
        self.assertTrue(inspect(SpeechDraft(mode="einfach",
            freeform="💜", observed_limits={"freeform":2})).ready)
        self.assertFalse(inspect(SpeechDraft(mode="einfach",
            freeform="💜", observed_limits={"freeform":1})).ready)

    def test_emoji_ab_same_words_accepted(self):
        x=module.compare_emoji_ab("Our family. Six. Six.",
                                  "💜 Our family. ⚡ Six. Six.")
        self.assertTrue(x.exact_spoken_words)
        self.assertIsNone(x.first_changed_word_index)

    def test_emoji_ab_rewritten_words_rejected(self):
        x=module.compare_emoji_ab("Where sound becomes identity.",
                                  "💜 Our sound creates identity.")
        self.assertFalse(x.exact_spoken_words)
        self.assertIsNotNone(x.first_changed_word_index)

    def test_emoji_ab_removed_words_rejected(self):
        x=module.compare_emoji_ab("Every memory holds meaning.",
                                  "💜 Every memory.")
        self.assertFalse(x.exact_spoken_words)
        self.assertEqual(x.first_changed_word_index,2)

    def test_emoji_ab_missing_reference_fails_closed(self):
        r=inspect(SpeechDraft(mode="erweitert",
                  script="💜 Our family.", tonfall="Warm",
                  experiment_literal_script_emoji=True))
        self.assertFalse(r.ready)

    def test_emoji_ab_changed_script_fails_closed(self):
        r=inspect(SpeechDraft(mode="erweitert", script="💜 Our joyful family.",
                  tonfall="Warm", experiment_literal_script_emoji=True,
                  reference_script="Our family."))
        self.assertFalse(r.ready)

    def test_emoji_ab_exact_script_passes_with_optin(self):
        r=inspect(SpeechDraft(mode="erweitert", script="💜 Our family.",
                  tonfall="Warm", experiment_literal_script_emoji=True,
                  reference_script="Our family."))
        self.assertTrue(r.ready)
        self.assertTrue(any("A/B" in note for note in r.notes))


if __name__ == "__main__":
    unittest.main()
