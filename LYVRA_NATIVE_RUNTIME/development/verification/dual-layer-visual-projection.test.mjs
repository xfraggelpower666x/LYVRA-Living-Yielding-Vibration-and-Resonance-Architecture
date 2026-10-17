import test from "node:test";
import assert from "node:assert/strict";
import {projectDualLayer} from "../dual-layer-visual-projection.mjs";
const item=(id,state,selected=false)=>({id,state,evidence_path:"test/"+id,priority_inputs:{creator_selected:selected}});
test("persistent view keeps projects despite changing priorities",()=>{const r={schema:"LYVRA_DUAL_LAYER_PROJECT_VIEW_V1",items:[item("old","PROPOSED"),item("new","DEV_ACTIVE",true)]};const v=projectDualLayer(r);assert.equal(v.dynamic[0].id,"new");assert.deepEqual(v.persistent.map(x=>x.id),["old","new"]);assert.equal(r.items[0].state,"PROPOSED")});
test("archived hidden only in projection, not discarded",()=>{const r={schema:"LYVRA_DUAL_LAYER_PROJECT_VIEW_V1",items:[item("arch","ARCHIVED"),item("open","PROPOSED")]};assert.equal(projectDualLayer(r).persistent.length,1);assert.equal(projectDualLayer(r,{includeArchived:true}).persistent.length,2);assert.equal(r.items.length,2)});
test("malformed or duplicate IDs fail closed",()=>{assert.throws(()=>projectDualLayer({schema:"other",items:[]}));assert.throws(()=>projectDualLayer({schema:"LYVRA_DUAL_LAYER_PROJECT_VIEW_V1",items:[item("x","PROPOSED"),item("x","PROPOSED")]}))});
test("no private vault contents or activation in projection",()=>{const r={schema:"LYVRA_DUAL_LAYER_PROJECT_VIEW_V1",items:[item("x","PROPOSED")]};const p=projectDualLayer(r);assert.equal(p.no_private_content,true);assert.equal(p.no_autoactivation,true)});
