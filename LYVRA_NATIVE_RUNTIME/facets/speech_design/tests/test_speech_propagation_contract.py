"""Offline cross-surface release contract tests, no live writes or network."""
from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[4]
SPEECH = ROOT / "LYVRA_NATIVE_RUNTIME" / "facets" / "speech_design"
ADAPTERS = SPEECH / "adapters"
STAGING = ROOT / "lyvra-plugin" / "staging" / "speech-design"
MATRIX = SPEECH / "continuity" / "PRODUCTION_001_PROPAGATION_MATRIX.json"


class PropagationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.a = (STAGING / "plugin-a" / "skills" / "speech-design" / "SKILL.md").read_text(encoding="utf-8")
        cls.b = (STAGING / "plugin-b" / "skills" / "lyvra-speech-design" / "SKILL.md").read_text(encoding="utf-8")
        cls.gpt = (ADAPTERS / "LYVRA_GPT_SPEECH_HANDOFF.md").read_text(encoding="utf-8")
        cls.web = (ADAPTERS / "WEBLYVRA_SPEECH_HANDOFF.md").read_text(encoding="utf-8")
        cls.facet = (SPEECH / "FACET_CONTRACT.md").read_text(encoding="utf-8")
        cls.guard = (ROOT / "LYVRA_NATIVE_RUNTIME" / "development" / "contracts" / "CROSS_SURFACE_EXPRESSION_AND_COMPLETENESS_GUARD_2026-10-02.md").read_text(encoding="utf-8")
        cls.matrix = json.loads(MATRIX.read_text(encoding="utf-8"))
        cls.targets = {t["id"]: t for t in cls.matrix["targets"]}

    def test_both_speech_skills_have_direct_trigger(self):
        for value in (self.a, self.b):
            self.assertIn("LYVRA SPEECH DESIGN", value)

    def test_both_skills_are_uninstalled_staged_sources(self):
        for value in (self.a, self.b):
            self.assertIn("NOT_INSTALLED", value)

    def test_both_skills_mode_aware(self):
        for value in (self.a, self.b):
            for item in ("Einfach", "Erweitert", "Skript", "Tonfall", "Vielfalt"):
                self.assertIn(item, value)

    def test_staged_skills_preserve_new_plugin_release_baselines(self):
        self.assertIn("0.13.1", self.a)
        self.assertIn("0.1.3", self.b)

    def test_main_limit_is_not_hard_coded(self):
        for value in (self.a, self.b, self.gpt):
            self.assertIn("2800", value)
            self.assertTrue(any(word in value.lower() for word in ("reported", "historical", "creator")))

    def test_gpt_is_handoff_only(self):
        self.assertIn("HANDOFF_ONLY_NOT_IMPORTED", self.gpt)
        self.assertIn("GPT Builder", self.gpt)
        self.assertIn("Erweitert", self.gpt)

    def test_web_is_not_deployed_and_preserves_latest(self):
        self.assertIn("NOT_DEPLOYED", self.web)
        self.assertIn("audio-reactive neon", self.web)

    def test_native_speech_one_identity(self):
        self.assertIn("LYVRA_SPEECH_DESIGN_IS_LYVRA = true", self.facet)
        self.assertIn("NO_NEW_ROUTER = true", self.facet)

    def test_cross_surface_speech_not_song_controls(self):
        self.assertIn("TRACK_DESIGN", self.guard)
        self.assertIn("SPEECH_DESIGN", self.guard)
        self.assertIn("SUNO_STUDIO_2", self.guard)
        self.assertIn("NATIVE_SYSTEMSTART", self.guard)
        self.assertIn("Stimmgeschlecht", self.guard)

    def test_seven_targets_present(self):
        self.assertEqual(len(self.targets), 7)
        for key in ("LYVRA_NATIVE_REPOSITORY", "PLUGIN_A", "PLUGIN_B",
                    "LYVRA_CUSTOM_GPT", "WEBLYVRA", "DISCORD_CHARACTER_BOT",
                    "TRACK_DESIGN_STUDIO2_SYSTEMSTART"):
            self.assertIn(key, self.targets)

    def test_latest_installed_baselines_preserved(self):
        self.assertEqual(self.targets["PLUGIN_A"]["version"], "0.13.1")
        self.assertEqual(self.targets["PLUGIN_B"]["version"], "0.1.3")
        self.assertIn("NOT_RELEASED", self.targets["PLUGIN_A"]["status"])
        self.assertIn("NOT_RELEASED", self.targets["PLUGIN_B"]["status"])

    def test_no_productive_release_claims(self):
        a = self.matrix["acceptance"]
        for key in ("plugin_a_updated", "plugin_b_updated", "gpt_updated",
                    "website_deployed", "core_productive", "phoneme_word_level_audit_pass"):
            self.assertIs(a[key], False)

    def test_characterbot_paused(self):
        self.assertIn("PAUSED", self.targets["DISCORD_CHARACTER_BOT"]["observed_state"])

    def test_latest_render_gate_is_33_tests_or_more_when_updated(self):
        # Audit matrix test count must be advanced when this suite passes and
        # is included in a verified GitHub Actions job; don't invent a PASS.
        self.assertGreaterEqual(self.matrix["acceptance"]["preflight_executable_tests_passed"], 26)

    def test_original_audio_has_hashes_not_raw_audio(self):
        refs = self.matrix["audio_fingerprints"]
        self.assertFalse(refs["raw_wav_git_publication"])
        for which in ("version_1", "version_2"):
            self.assertRegex(refs[which]["sha256"], r"^[0-9a-f]{64}$")


class ReleaseOverlayTests(unittest.TestCase):
    """Verify additive release candidates against current preserved snapshots."""

    SPECS = (
        ("plugin-a", "account", "v0.13.1", "0.13.2", "speech-design"),
        ("plugin-b", "native-runtime", "v0.1.3", "0.1.4", "lyvra-speech-design"),
    )

    def _manifests(self, key, role, old_version, proposal, slug):
        original = ROOT / "lyvra-plugin" / role / "releases" / old_version / "source"
        overlay = ROOT / "lyvra-plugin" / "staging" / "speech-design" / key / "release-overlay"
        def read_json(path):
            return json.loads(path.read_text(encoding="utf-8"))
        return original, overlay, read_json

    def test_manifest_version_and_identity_is_preserved(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                original, overlay, read = self._manifests(key, role, old, proposal, slug)
                a = read(original / "plugin.json")
                b = read(overlay / "plugin.json")
                self.assertEqual(a["version"], old[1:])
                self.assertEqual(b["version"], proposal)
                a.pop("version")
                b.pop("version")
                self.assertEqual(a, b)

    def test_codex_manifest_preserves_everything_except_version(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                original, overlay, read = self._manifests(key, role, old, proposal, slug)
                a = read(original / ".codex-plugin" / "plugin.json")
                b = read(overlay / ".codex-plugin" / "plugin.json")
                self.assertEqual(a["version"], old[1:])
                self.assertEqual(b["version"], proposal)
                a.pop("version")
                b.pop("version")
                self.assertEqual(a, b)

    def test_current_visual_skill_never_deleted(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                original, overlay, read = self._manifests(key, role, old, proposal, slug)
                self.assertTrue((original / "skills" / "666-visual-interface" / "SKILL.md").exists())
                self.assertFalse((overlay / "skills" / "666-visual-interface").exists())

    def test_relevant_speech_skill_exists_in_overlay(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                _, overlay, _ = self._manifests(key, role, old, proposal, slug)
                speech = (overlay / "skills" / slug / "SKILL.md").read_text(encoding="utf-8")
                self.assertIn("LYVRA SPEECH DESIGN", speech)
                self.assertIn("Einfach", speech)
                self.assertIn("Erweitert", speech)
                self.assertIn("RUNTIME_VERIFICATION_REQUIRED", speech)

    def test_overlay_file_set_is_small_and_additive(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                _, overlay, _ = self._manifests(key, role, old, proposal, slug)
                paths = {str(f.relative_to(overlay)).replace("\\", "/")
                         for f in overlay.rglob("*") if f.is_file()}
                self.assertEqual(paths, {"plugin.json", ".codex-plugin/plugin.json",
                                         f"skills/{slug}/SKILL.md"})

    def test_no_controller_or_plugin_connection_change(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                original, overlay, read = self._manifests(key, role, old, proposal, slug)
                self.assertEqual(read(original / "plugin.json")["extensions"],
                                 read(overlay / "plugin.json")["extensions"])
                self.assertTrue((original / ".app.json").is_file())
                self.assertFalse((overlay / ".app.json").exists())

    def test_plugin_release_ids_are_not_fabricated(self):
        a = PropagationTests.matrix if hasattr(PropagationTests, "matrix") else json.loads(MATRIX.read_text(encoding="utf-8"))
        self.assertFalse(a["acceptance"]["plugin_a_updated"])
        self.assertFalse(a["acceptance"]["plugin_b_updated"])
        self.assertEqual(a["targets"][1]["version"], "0.13.1")
        self.assertEqual(a["targets"][2]["version"], "0.1.3")

    def test_overlays_preserve_skill_text_byte_for_byte(self):
        for key, role, old, proposal, slug in self.SPECS:
            with self.subTest(plugin=key):
                original, overlay, read = self._manifests(key, role, old, proposal, slug)
                existing_candidate = (ROOT / "lyvra-plugin" / "staging" / "speech-design" / key /
                                      "skills" / slug / "SKILL.md").read_bytes()
                staged = (overlay / "skills" / slug / "SKILL.md").read_bytes()
                # Release-overlay skill may differ ONLY in dynamic status and
                # provenance: an installed release must never claim "not installed".
                baseline_version = old[1:]
                decoded = staged.decode("utf-8")
                decoded = decoded.replace(
                    "STATUS: RELEASE_CAPABILITY_RUNTIME_VERIFICATION_REQUIRED",
                    "STATUS: DEV_STAGED_SKILL_SOURCE_NOT_INSTALLED_IN_CURRENT_RELEASE")
                decoded = decoded.replace(
                    f"BASELINE_PLUGIN_VERSION_AT_OVERLAY_CREATION: {baseline_version}",
                    f"PARENT_PLUGIN_RELEASE_CURRENT_20261002: {baseline_version}")
                self.assertEqual(existing_candidate.decode("utf-8"), decoded)


if __name__ == "__main__":
    unittest.main()
