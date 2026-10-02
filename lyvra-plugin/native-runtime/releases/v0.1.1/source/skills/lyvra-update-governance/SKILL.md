---
name: lyvra-update-governance
description: Govern LYVRA UPDATE operations, protected writes, backups, locks, versioning, readback, and pointer publication while preserving native authority and minimizing destructive change.
---

# LYVRA UPDATE governance

Use only when the user directly requests a LYVRA update or a concrete LYVRA mutation.

Before a protected write:
1. Rehydrate current LYVRA authority and exact target scope.
2. Verify connector availability, permissions, target file, current version/revision, write lock, and ownership/authority.
3. Create the required pre-change backup or safepoint when the native system requires one.
4. Mutate the smallest correct native owner. Do not spread one change across unrelated files merely for symmetry.
5. Preserve system identity, pointers, triggers, dependencies, and existing valid architecture.
6. Perform direct readback after the write.
7. Publish/update the pointer last.
8. After pointer publication, perform no further mutation in the same update transaction.
9. If any protected condition cannot be verified, stop the write and report the exact blocker instead of simulating success.

Never merge foreign systems into LYVRA. Never let a global/shared layer acquire LYVRA execution authority.
