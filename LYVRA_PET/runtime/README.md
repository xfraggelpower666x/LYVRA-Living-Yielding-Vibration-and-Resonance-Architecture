# LYVRA PET Runtime Surface

This directory is the canonical repository home for every runtime artifact that belongs specifically to the LYVRA Pet.

## Authority rule
The external host/runtime is never the only source of truth. Any Pet-specific Worker, UI, manifest, routing contract, deployment state, recovery note, plugin binding or verification result must be represented here.

## Structure
- `cloudflare/` — Worker source/config/deployment metadata and zero-cost policy
- `ui/` — Pet app-view/browser UI source and presentation contract
- `plugin/` — bindings between LYVRA plugins and the Pet capability
- `recovery/` — restore/rollback instructions and known-good references

Whole LYVRA remains the native authority. `LYVRA_PET/` is the canonical Pet surface.
