# LYVRA PET Plugin Bindings

The Pet capability is shared by both LYVRA plugin surfaces.

Current plugin surfaces:
- L.Y.V.R.A. account plugin
- lyvra-native-runtime

Rule:
Both plugins reference the same `LYVRA_PET/` authority. They must not embed divergent Pet copies.

Current Pet skill contract:
- `skills/lyvra-pet/SKILL.md`
- `references/pet-authority.md`

Planned UI bridge:
- one shared Pet MCP/App endpoint
- both LYVRA plugins bind to the same endpoint
- repository remains source authority
- external runtime remains replaceable/recoverable
