# LYVRA Pet -> PFS Backup Handoff

This directory contains LYVRA-authored handoff material for PFS backup/recovery mirroring.

Boundary:
- LYVRA remains live functional authority.
- PFS may store backup/recovery copies only.
- PFS must not become Pet runtime, deployment, routing, or identity authority.
- No foreign autoactivation.
- Consumption and backup write occur only during an explicit `666PFS UPDATE`.
