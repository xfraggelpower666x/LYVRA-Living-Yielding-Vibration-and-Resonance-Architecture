import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const contract=JSON.parse(await readFile(new URL('./CODEFORGE_PARALLEL_GOVERNANCE_CONTRACT.json',import.meta.url),'utf8'));
const main={head:'main-001',files:new Map([['core.js','base'],['pet.js','pet0'],['speech.js','speech0']])};
function inspect({scope,base,changes,activeRefs=[],ci=true,backup=true,approved=true,dependencies=[],deployments=[]}){
 const overlap=changes.some(c=>!scope.includes(c.path));
 const stale=base!==main.head;
 const safe= !overlap&&!stale&&ci&&backup&&approved&&dependencies.length===0;
 return {status:safe?'READY_FOR_INTEGRATION':'BLOCKED',reasons:[overlap&&'OUT_OF_SCOPE',stale&&'STALE_MAIN_HEAD',!ci&&'CI_FAILED',!backup&&'BACKUP_MISSING',!approved&&'APPROVAL_MISSING',dependencies.length&&'DEPENDENCY_BLOCKED'].filter(Boolean),cleanup: safe&&activeRefs.length===0&&deployments.length===0?'ELIGIBLE_AFTER_VERIFIED_MERGE':'BLOCKED'};
}
const pet=inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js',value:'pet1'}]});
const speech=inspect({scope:['speech.js'],base:'main-001',changes:[{path:'speech.js',value:'speech1'}]});
assert.equal(pet.status,'READY_FOR_INTEGRATION');
assert.equal(speech.status,'READY_FOR_INTEGRATION');
assert.equal(main.files.get('pet.js'),'pet0','Scenario simulation must not mutate main');
assert.equal(main.files.get('speech.js'),'speech0');
assert.deepEqual(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'speech.js'}]}).reasons,['OUT_OF_SCOPE']);
assert.deepEqual(inspect({scope:['pet.js'],base:'old-head',changes:[{path:'pet.js'}]}).reasons,['STALE_MAIN_HEAD']);
assert.deepEqual(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],ci:false}).reasons,['CI_FAILED']);
assert.deepEqual(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],backup:false}).reasons,['BACKUP_MISSING']);
assert.deepEqual(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],approved:false}).reasons,['APPROVAL_MISSING']);
assert.equal(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],activeRefs:['other-chat']}).cleanup,'BLOCKED');
assert.equal(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],deployments:['live-worker']}).cleanup,'BLOCKED');
assert.equal(inspect({scope:['pet.js'],base:'main-001',changes:[{path:'pet.js'}],dependencies:['plugin-contract']}).status,'BLOCKED');
assert.equal(contract.workspace_policy.cross_chat_last_writer_wins,false);
assert.ok(contract.promotion_sequence.indexOf('MERGE_READBACK')<contract.promotion_sequence.indexOf('SAFE_BRANCH_CLEANUP'));
console.log('PASS simulated independent workspaces, scope overlap, stale main, CI/backup/approval/dependency failures, active branch/deploy cleanup guards; NO ACTUAL MERGE');
