# SuperCodeForge Parallel Cooperation R02

This is an additive Whole-LYVRA-owned capability layer beneath the existing SuperCodeForge facet. It does not create a new system, router, controller, shared authority, autonomous agent swarm or transport.

- Capability Contract validates typed source provenance, native permission ownership, operations and evidence stages. Caller-supplied metadata cannot promote source, delivery, adoption or host.
- Capability Catalog stores validated metadata in memory; it has no provider handles.
- Peer Source Registry stores exact source snapshots and quarantines pointer/state mismatches. It does not fetch or activate peers.
- Parallel Wave Planner computes topological work waves with read/write-scope conflict isolation. It never dispatches.
- Composition Planner produces reviewable plans only.
- Evidence Ledger stores in-memory provenance records with local digest integrity only; it does not authenticate peers or persist across restarts.

The existing LYVRA CodeForge remains the technical self-understanding layer. SuperCodeForge remains the fifth-choice submenu. Peer identities, permissions, current pointers and execution authorities remain native to their owners.
