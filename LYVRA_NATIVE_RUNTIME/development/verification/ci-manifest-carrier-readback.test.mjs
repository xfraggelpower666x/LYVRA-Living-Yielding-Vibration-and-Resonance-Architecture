import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {inspectCheckoutManifest} from './ci-manifest-carrier-readback.mjs';
const head=()=>execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
test('manifest has complete source diagnostics and no runtime overclaim',()=>{
 const r=inspectCheckoutManifest({expectedHead:head()});
 assert.equal(r.contract,'LYVRA_CI_MANIFEST_READBACK_V1');
 assert.equal(r.stages[0].stage,'PRE_REHYDRATION_OVERSTEER_GUARD');
 assert.equal(r.stages.at(-1).stage,'CURRENT_WORK_SCOPE');
 assert.equal(r.stages.length,28);
 assert.equal(r.semantic_rehydration_verified,false);
 assert.equal(r.host_runtime_verified,false);
 assert.equal(r.communications_blocked,false);
});
test('stage locations include independent pet and WebLyvra carriers',()=>{
 const r=inspectCheckoutManifest({expectedHead:head()});
 const p=r.stages.find(x=>x.stage==='PET_EXPRESSION_CONTINUITY');
 assert.ok(p.carrier_results.some(x=>x.path.startsWith('LYVRA_PET/')));
 assert.ok(p.carrier_results.some(x=>x.path.startsWith('WEBLyvra/')));
});
test('unmapped stages are reported rather than invented',()=>{
 const r=inspectCheckoutManifest({expectedHead:head()});
 assert.ok(r.stages.some(x=>x.coverage==='UNMAPPED'));
 assert.equal(r.coverage.mapped+r.coverage.unmapped,28);
});
test('currentness cannot come from a claimed head',()=>assert.throws(()=>inspectCheckoutManifest({expectedHead:'f'.repeat(40)}),/HEAD_MISMATCH/));
test('unsafe manifest path is rejected',()=>{
 for(const p of ['/etc/passwd','LYVRA_NATIVE_RUNTIME/../README.md','any/manifest.json'])
 assert.throws(()=>inspectCheckoutManifest({manifestPath:p,expectedHead:head()}),/INVALID_MANIFEST_PATH/);
});
test('source readback never automatically means semantic understanding',()=>{
 const r=inspectCheckoutManifest({expectedHead:head()});
 assert.ok(r.stages.every(x=>x.semantic_understanding==='NOT_TESTED'&&x.runtime_verified===false));
 assert.equal(r.facet_activation,false);assert.equal(r.mutation,false);
});

test('exact committed manifest bytes preserve trailing newline',()=>{
 const raw=execFileSync('git',['show','HEAD:LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json'],{encoding:'utf8'});
 const disk=readFileSync('LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json','utf8');
 assert.equal(raw,disk);
 assert.equal(inspectCheckoutManifest({expectedHead:head()}).manifest_blob,execFileSync('git',['rev-parse','HEAD:LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json'],{encoding:'utf8'}).trim());
});
