// Source-level regression. Synthetic ledger ONLY validates rejection/shape; never host PASS.
import assert from 'node:assert/strict';
import {projectR50Intake,R50_STRANDS} from './r50-parallel-intake.mjs';
const head='6337840188b0f2b15ef070f9872f65b0ae2bba53';
const pointerBlob='87b6d6cfd400e3866b211bb8b49d683098fbff65';
const ledger={productive_head:head,productive_pointer_blob:pointerBlob,
 strands:R50_STRANDS.map(id=>({id})),
 r30_open_ids:['T07','T18','T19','T20','T21','T22','T23','T24','T25'],
 paused_return_lanes:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],return_anchor:'ANALYTICS',
 host_gates_open:18,host_gates_closed_by_this_round:0,writes:{production:0}};
const opts={head,pointerBlob,knownTasks:[{id:'T22',strand:'VISUAL',acceptance_key:'native+alive host readback'}]};
const e={id:'r50-visual',kind:'NEW_EVIDENCE',strand:'VISUAL',source:'R49_AND_CREATOR_CHAT_BACKUP',
 description:'Visual inherited menus requested',acceptance_key:'native+alive host readback',related_strands:['ANALYTICS']};
let count=0;const check=(what,value)=>{assert.ok(value,what);count++};
const reject=(what,fn)=>{assert.throws(fn,undefined,what);count++};
const result=projectR50Intake(ledger,[e],opts);
check('existing issue not duplicated',result.events[0].related_task_id==='T22');
check('no autopromotion',result.events[0].classification==='EXISTING_GATE_NEW_EVIDENCE');
check('all six preserved',result.preserved.strands.length===6);
check('all nine open',result.preserved.r30_open.length===9);
check('host still open',result.preserved.host_gates_open===18&&!result.host_accepted);
check('no writes or scheduler',!result.persistent_write&&!result.new_scheduler);
reject('stale current',()=>projectR50Intake(ledger,[e],{...opts,head:'0'.repeat(40)}));
reject('foreign relation',()=>projectR50Intake(ledger,[{...e,related_strands:['666CLIC']}],opts));
reject('fake host evidence',()=>projectR50Intake(ledger,[{...e,host_verified:true}],opts));
reject('lost backlog',()=>projectR50Intake({...ledger,r30_open_ids:['T07']},[e],opts));
reject('duplicate intake',()=>projectR50Intake(ledger,[e,e],opts));
reject('no provenance',()=>projectR50Intake(ledger,[{...e,source:''}],opts));
reject('ambiguous acceptance gate across two tasks',()=>projectR50Intake(ledger,[e],{...opts,knownTasks:[{id:'T21',strand:'VISUAL',acceptance_key:'native+alive host readback'}, {id:'T22',strand:'VISUAL',acceptance_key:'  NATIVE+ALIVE   HOST READBACK  '}]}));
const claimedResume=projectR50Intake(ledger,[{...e,id:'r57-resume',kind:'RESUME',verified_checkpoint:'HOST_PASS_NOT_REAL'}],opts);
check('unverified claimed checkpoint never promoted',claimedResume.events[0].checkpoint===null);
check('unverified claim remains visible for source verification',claimedResume.events[0].checkpoint_claim==='HOST_PASS_NOT_REAL'&&claimedResume.events[0].resume_status==='CHECKPOINT_READBACK_REQUIRED');
reject('nonarray relationship input cannot silently discard dependencies',()=>projectR50Intake(ledger,[{...e,related_strands:'ANALYTICS'}],opts));
console.log(JSON.stringify({result:'PASS',checks:count,scope:'SOURCE_REGRESSION_ONLY',hostAccepted:false}));
