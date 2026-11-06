import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Real repository current-source acceptance; no fabricated Suno render or mocked host.
// This checks contract compatibility and cannot prove provider/UI runtime behavior.
const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const readCurrent = (name) => readFileSync(resolve(runtimeRoot, name), 'utf8');

const routes = readCurrent('current/music/TRACK_DESIGN_IPHONE_CUSTOM_THREE_ROUTES_20261029.md');
const sub = readCurrent('current/music/TRACK_DESIGN_SUB_REHYDRATION.md');
const guard = readCurrent('current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md');
const copyRegression = readCurrent('development/tests/track-relational-renderer-output.test.mjs');

test('actual creator-confirmed iPhone Custom no-Main route overrides generic controls', () => {
  assert.match(routes, /DEVICE_SCOPE = IPHONE_APP_PRO6_CUSTOM_NO_MAIN/);
  assert.match(routes, /DURATION_SLIDER = NOT_VISIBLE_CREATOR_CONFIRMED/);
  assert.match(routes, /Do NOT invent Main, My Taste, Exclude Styles or slider controls/);
  assert.match(sub, /ROUTE_PRECEDENCE = CURRENT_CREATOR_VERIFIED_DEVICE_ROUTE_GT_HISTORICAL_GENERIC_VISIBLE_OUTPUT_TABLE/);
  assert.match(sub, /IPHONE_APP_PRO6_CUSTOM_NO_MAIN_COPY_FIELD_COUNT = 4/);
  for (const forbidden of ['MAIN_INPUT', 'MY_TASTE', 'EXCLUDE_STYLES_FIELD', 'DURATION_SLIDER']) {
    assert.match(sub, new RegExp('IPHONE_APP_PRO6_CUSTOM_NO_MAIN_' + forbidden + ' = (?:ABSENT|DO_NOT_INVENT)'));
  }
});

test('PC browser duration slider remains its own genuine route', () => {
  assert.match(routes, /DEVICE_SCOPE = PC_BROWSER/);
  assert.match(routes, /DURATION_SLIDER = PRIMARY_DURATION_CONTROL_WHEN_VISIBLE/);
  assert.match(sub, /PC_BROWSER = PRESERVE_CREATOR_VERIFIED_CONTROLS_AND_DURATION_SLIDER_WHEN_VISIBLE/);
});

test('copy exactness and UTF-16 policy survive scoped correction', () => {
  assert.match(routes, /OUTPUT_GUARD = PREVALIDATE_FULL_RENDERED_COPY_PAYLOAD \| COUNT_UTF16_WITH_EMOJI_AND_NEWLINES \| AUTO_REPAIR \| RECOUNT \| COPY_VALID_VERSION/);
  assert.match(sub, /COPY_PAYLOAD = EXACT_FINAL_VISIBLE_STRING/);
  assert.match(sub, /CHARACTER_COUNT = UTF16_CODE_UNITS_IN_EXACT_COPY_PAYLOAD_INCLUDING_EMOJI_AND_NEWLINES/);
  assert.match(copyRegression, /const size=blocks\[0\]\[1\]\.length/);
  assert.match(copyRegression, /test\('UTF-16 over-limit Style rejected despite codepoint count fitting'/);
  assert.match(guard, /RENDERER_TRANSLATION_FACET_NE_COMPOSER = true/);
});

test('correction does not erase older optional codeboxes or claim live acceptance', () => {
  assert.match(sub, /VISIBLE_STANDARD_CODEBOX_COUNT = 5/); // historical generic context preserved
  assert.match(sub, /OPTIONAL_MY_TASTE_AND_OTHER_REAL_UI = CONTEXTUAL_ONLY_WHEN_OBSERVED_FOR_SELECTED_ROUTE/);
  assert.match(sub, /ACTUAL_SUNO_AND_HOST_ACCEPTANCE = STILL_SEPARATE/);
  assert.match(sub, /MUSIC_INTELLIGENCE_AND_OTHER_NATIVE_FACETS = UNCHANGED/);
});
