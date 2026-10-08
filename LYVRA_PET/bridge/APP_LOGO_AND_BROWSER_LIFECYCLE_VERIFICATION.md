Status: PARTIAL. Original Pet sprite atlas unchanged; own Pet PRIMARY, GPT Pet SECONDARY.

Supplied LYVRA_PET_APP_WITH_LOGOS_v1_0_1.zip contains app metadata and two PNGs, not a renderer. App identity asdk_app_6ac6fbaed2a481919fad519862e7b7f0 preserved. assets/logo-assets.mjs stores exact PNG bytes, sizes and SHA-256. Worker exposes both logos and uses app-logo.png in its header; browser inserts the supplied branding outside the sprite stage. No outer host icon update is claimed.

Browser fixes: manual sprites interrupt evidence previews; expression preview stops previous primary animation; latest async preview wins; late module completion after pagehide does not mount; competing evidence connections do not create orphan controllers; beat calls after pagehide return false; initial idle cannot overwrite an earlier explicit preview.

Verification: executable vm-based lifecycle tests (not a real browser), original-atlas Canvas tests, Worker HTML/script/MCP checks, canonical embedded-helper parity, both logo routes byte/hash exact. Test commands: node LYVRA_PET/bridge/verify-browser-lifecycle.mjs; node LYVRA_PET/bridge/verify-preview-interruption.mjs; node LYVRA_PET/bridge/build-worker-runtime.mjs --check.

Remaining: authenticated native event producer, exact new body/hand frames for yawn/stomp/humor/conducting, real browser/host verification, native plugin release parity and deployment. No production pointer or live release changed.
