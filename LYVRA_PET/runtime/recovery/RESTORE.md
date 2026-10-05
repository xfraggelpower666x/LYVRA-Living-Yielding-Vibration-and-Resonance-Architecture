# LYVRA PET Runtime Restore

Recovery order:

1. Restore or select the last verified LYVRA repository commit containing `LYVRA_PET/`.
2. Read `LYVRA_PET/verification/` and the current Pet extension manifests.
3. Read `LYVRA_PET/runtime/cloudflare/deployment-state.json`.
4. Recreate the Worker from the versioned source under `LYVRA_PET/runtime/cloudflare/worker/`.
5. Recreate or reconnect the Pet App View from `LYVRA_PET/runtime/ui/`.
6. Rebind both LYVRA plugin surfaces to the verified endpoint.
7. Perform direct host/render readback.
8. Mark VERIFIED only after Worker + MCP endpoint + plugin binding + app view are all proven.

Never restore from the external Worker alone when the repository source is available.
