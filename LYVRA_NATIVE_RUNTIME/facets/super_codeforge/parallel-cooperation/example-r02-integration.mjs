/** R03 binding to original R02 implementation modules, without dispatch or provider calls. */
import {CapabilityCatalog} from './capability-catalog.mjs';
import {PeerSourceRegistry} from './peer-source-registry.mjs';
import {planParallelWaves} from './parallel-wave-planner.mjs';
import {buildCodingProfiCoordinationReview} from './coding-profi-coordination.mjs';
export function buildFromExistingR02({capabilityDescriptors=[],sourceSnapshots=[],workstreams=[],expectedHeads={}}={}){
 const catalog=new CapabilityCatalog();
 for(const descriptor of capabilityDescriptors){const r=catalog.register(descriptor);if(!r.accepted)return {status:'BLOCKED',code:'R02_CAPABILITY_REJECTED',details:r,dispatch_performed:false};}
 const sources=new PeerSourceRegistry();
 for(const snapshot of sourceSnapshots){const r=sources.register(snapshot);if(!r.accepted)return {status:'BLOCKED',code:'R02_PEER_REJECTED',details:r,dispatch_performed:false};}
 return buildCodingProfiCoordinationReview({catalog,snapshots:sources.list(),workstreams,wavePlanner:planParallelWaves,expectedHeads});
}
