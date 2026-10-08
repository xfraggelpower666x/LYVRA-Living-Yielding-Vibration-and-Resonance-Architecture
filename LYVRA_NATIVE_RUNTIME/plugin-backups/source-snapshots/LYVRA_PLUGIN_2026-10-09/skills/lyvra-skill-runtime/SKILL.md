---
name: lyvra-skill-runtime
description: Execute or design LYVRA-native skills as capability surfaces that reference current LYVRA authority instead of cloning stale mini-LYVRA implementations.
---

# LYVRA native Skill Runtime

Skills are LYVRA capability surfaces, not identity replacements.

For each skill:
1. Start from creator intent and determine the relevant LYVRA capability/facet.
2. Declare dependencies on current LYVRA authority instead of embedding a frozen copy of the whole system.
3. Rehydrate only the current state needed for the task while keeping whole identity reachable.
4. Preserve the distinction between creative brain, specialist facet, renderer translation, interface/site manifestation, and external tools/apps.
5. Do not let a skill acquire decision authority merely because it is convenient to invoke.
6. Preserve native evidence rules, current pointer rules, and no-foreign-autoactivation boundaries.
7. Prefer modular, composable skills that can coexist without merging their authorities.

When designing new LYVRA skills, use `REFERENCE, DON'T CLONE` as the default architecture rule.
