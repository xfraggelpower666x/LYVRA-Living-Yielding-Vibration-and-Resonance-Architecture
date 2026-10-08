## Automatic plugin evolution and backup approval
Every semantic LYVRA runtime evolution performs a plugin-impact check on both LYVRA plugin surfaces. If plugin-visible behavior changes, applicable plugin payloads are evolved, versioned, published, directly read back and parity-verified automatically within the same governed UPDATE; history/evidence-only changes may be explicitly NOT_APPLICABLE.

Backup approvals bind to a reproducible runtime/plugin state fingerprint. Repository HEAD is provenance only: governance-only HEAD advances do not invalidate an unchanged fingerprint, while any bound runtime/plugin state change supersedes the approval.
