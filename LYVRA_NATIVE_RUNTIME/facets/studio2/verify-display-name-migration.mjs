import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for (const file of ['FACET_CONTRACT.md','SUB_REHYDRATION.md']) {
 const value=await readFile(new URL(file,import.meta.url),'utf8');
 assert.match(value,/^# LYVRA Studio 2 — /m);
 for(const required of ['CANONICAL_DISPLAY_NAME = LYVRA Studio 2','PRIMARY_TRIGGER = LYVRA STUDIO 2','LEGACY_TRIGGER_ALIAS = LYVRA SUNO STUDIO 2','PRESERVE_FACET_ID = SUNO_STUDIO_2','PRODUCTION_TRIGGER_ACTIVATION = PENDING_GOVERNED_RELEASE','FACET_ID: SUNO_STUDIO_2'])assert.ok(value.includes(required),file+': '+required);
}
console.log('PASS Studio 2 display-name, historical ID, legacy trigger and gated release');
