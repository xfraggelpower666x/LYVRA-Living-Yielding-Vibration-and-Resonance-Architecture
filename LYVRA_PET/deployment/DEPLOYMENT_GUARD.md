# LYVRA Pet Browser Deployment Guard

Status: DEPLOYED_API_VERIFIED / CHATGPT_APP_UI_VERIFIED / PET_LOGO_DEPLOYED_SOURCE_VERIFIED / HOST_VISUAL_READBACK_PENDING

Purpose: operate the Pet as an independent browser surface without changing LYVRA main-plugin availability.

Current Worker:
- name: `lyvra-pet-plugin-ui`
- workers.dev origin: `https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev`
- current deployment id: `de607f5d-99ba-406a-a4b7-8378c6511468`
- current version id: `2dd20285-740f-4349-a145-a73807961fda`
- previous recovery deployment: `d7284ef3-d4dd-40e6-8b9d-e086ad4db5c4`
- previous recovery version: `e156c4f5-e31a-47b4-aa58-4e61c3d2cf6c`

Verified by Cloudflare API:
- worker upload accepted
- new deployment active at 100%
- deployed source readback contains verified sprite renderer
- embedded ChatGPT App UI uses absolute Worker asset URL
- ChatGPT App UI itself has been user-visible in ChatGPT Web; sprite visual readback remains pending
- PET logo route `/asset/pet-logo.png` is present in deployed Worker source
- PET App binding `asdk_app_6ac6fbaed2a481919fad519862e7b7f0` is present in deployed Worker source
- PET logo SHA-256 is `a070281f76e2be032fa00a06fb54141b8791738cd964792eef0a58d94f0a16bb`
- verified atlas SHA-256 is `f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba`
- atlas source is pinned to immutable GitHub commit `243eaf3e8baccaf4e103d05fcfb983b0a08252a7`

Readback limitation:
- public HTTP verification from the available external readers is currently unavailable.
- therefore HOST_VISUAL_RENDER is not claimed as VERIFIED yet.

Rules:
- no main-plugin MCP binding
- branded plugin releases are permitted only when PET/App integration requires them
- no WEBLyvra mutation
- no custom-domain mutation
- no paid Cloudflare feature
- no secrets in repository
- FREE_ONLY = TRUE

MAIN_PLUGIN_BINDING = FALSE
PLUGIN_RELEASE_MUTATION = NATIVE_0.1.49_AND_ACCOUNT_0.13.46_VERIFIED
WEBLYVRA_MUTATION = BRANDED_PET_DASHBOARD_ONLY_VERIFIED
CUSTOM_DOMAIN_MUTATION = NONE
PUBLIC_HTTP_READBACK = PENDING
