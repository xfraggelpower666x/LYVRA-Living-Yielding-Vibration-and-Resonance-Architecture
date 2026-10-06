# LYVRA Pet Runtime

Status: PREPARED_BROWSER_RUNTIME / NOT_BOUND / NOT_DEPLOYED

Authority remains `LYVRA_PET/` under Whole-LYVRA.

This runtime exists to support a browser-capable Pet surface without binding either LYVRA main plugin to a Pet-specific host.

Hard guards:
- PET != SECOND_IDENTITY
- NO_MAIN_PLUGIN_HOST_BINDING = TRUE
- BROWSER_SURFACE_INDEPENDENT = TRUE
- APP_ONLY_DEPENDENCY = FORBIDDEN
- FREE_ONLY = TRUE
- REFERENCE_DONT_CLONE = TRUE

The runtime may consume the verified routing under:
`LYVRA_PET/extensions/lyvra-reaction-music-v1/runtime-routing.json`

No production deployment is implied by this directory.
