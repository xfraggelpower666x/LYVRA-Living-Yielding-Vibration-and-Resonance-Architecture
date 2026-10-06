# LYVRA Pet Browser Deployment Guard

Status: DEPLOYED_API_VERIFIED / PUBLIC_HTTP_READBACK_PENDING

Purpose: operate the Pet as an independent browser surface without changing LYVRA main-plugin availability.

Current Worker:
- name: `lyvra-pet-plugin-ui`
- workers.dev origin: `https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev`
- current deployment id: `d7284ef3-d4dd-40e6-8b9d-e086ad4db5c4`
- current version id: `e156c4f5-e31a-47b4-aa58-4e61c3d2cf6c`
- previous recovery deployment: `11aabff6-85a8-4df6-8aef-a74e9fac1cda`
- previous recovery version: `a91a865b-1cc3-4afe-b882-8ff9a2f6be68`

Verified by Cloudflare API:
- worker upload accepted
- new deployment active at 100%
- deployed source readback contains verified sprite renderer
- verified atlas SHA-256 is `f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba`
- atlas source is pinned to immutable GitHub commit `243eaf3e8baccaf4e103d05fcfb983b0a08252a7`

Readback limitation:
- public HTTP verification from the available external readers is currently unavailable.
- therefore HOST_VISUAL_RENDER is not claimed as VERIFIED yet.

Rules:
- no main-plugin MCP binding
- no plugin release mutation
- no WEBLyvra mutation
- no custom-domain mutation
- no paid Cloudflare feature
- no secrets in repository
- FREE_ONLY = TRUE

MAIN_PLUGIN_BINDING = FALSE
PLUGIN_RELEASE_MUTATION = NONE
WEBLYVRA_MUTATION = NONE
CUSTOM_DOMAIN_MUTATION = NONE
PUBLIC_HTTP_READBACK = PENDING
