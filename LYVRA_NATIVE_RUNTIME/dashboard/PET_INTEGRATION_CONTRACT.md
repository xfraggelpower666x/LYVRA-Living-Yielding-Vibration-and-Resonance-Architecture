# LYVRA Pet Dashboard Integration

Every Whole-LYVRA dashboard must represent Pet state when available.

## Required status block

| Field | Meaning |
|---|---|
| PET AUTHORITY | Current `LYVRA_PET/` source status |
| PET ID | Current verified Pet ID |
| PET LIVECIRCLE | `LYVRA_PET/livecircle/CURRENT_STATE.json` |
| PET REHYDRATION | `LYVRA_PET/rehydration/REHYDRATION_MANIFEST.json` |
| PET VISUAL CONTRACT | `LYVRA_PET/visual/VISUAL_INTERFACE_CONTRACT.md` |
| PLUGIN ACCOUNT | L.Y.V.R.A. Pet capability/binding |
| PLUGIN NATIVE | lyvra-native-runtime Pet capability/binding |
| MCP/WORKER | Pet browser bridge deployment |
| HOST RENDER | Actual ChatGPT/browser render evidence |
| WEBLYVRA | Website Pet integration state |
| VISUAL ASSET | Verified atlas/frame availability |
| COST GUARD | FREE_ONLY |
| BLOCKERS | Binary transport/readback/integration blockers |

## Presentation rule
Use VERIFIED / PARTIAL / READBACK_PENDING / WRITE_BLOCKED / BLOCKED explicitly.

Do not hide Pet state inside generic plugin status.

The Pet is shown as a native Whole-LYVRA capability surface under LYVRA, not beside LYVRA as another system.

Dashboard surfaces and WEBLyvra must reference the same Pet authority and current state. No dashboard may fork Pet identity/state.
