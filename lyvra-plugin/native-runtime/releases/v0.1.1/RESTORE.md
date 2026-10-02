# LYVRA Native Runtime v0.1.1 — source snapshot

This is an **additive source snapshot** of the ten textual files fetched from the official Plugin Creator current release on 2026-10-02. It is **not** a binary-identical export of the original tar.gz and does not confer native LYVRA authority.

## Restore procedure

1. Confirm the plugin backend ID and the intended revision; compare with the official Plugin Creator releases.
2. Check `PROVENANCE.json`, source paths and Git file SHA fingerprints against the pinned backup commit.
3. Copy the `source/` subtree without changing relative paths into a new plugin archive; preserve any other existing assets from the relevant plugin release.
4. Validate both plugin manifests, five native skills and immutable authority boundaries. Test `LYVRA SYSTEMSTART` read-only.
5. Use Plugin Creator with explicit authorized scope and expected current-release guard; separately verify the new plugin release by direct readback.

No automatic restore, PFS write, GitHub CURRENT pointer change or cross-system activation is performed by this snapshot.
