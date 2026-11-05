// LYVRA R33: nativer Datensicht-Adapter der bestehenden Semantic Visual Intelligence.
// Read-only. Keine Visual Engine, kein Router, kein neuer Controller, keine Host-PASS-Erfindung.
export const SIX_STRANDS=Object.freeze(["DICTATION","ANALYTICS","CHARACTER_RELATIONS","VISUAL","INTERRUPTION_CONTINUITY","RESEARCH"]);
export const PAUSED_AREAS=Object.freeze(["POST","SCEERI_MYCEL","PLUGIN_HOST_ACCEPTANCE"]);
const names={DICTATION:"Spracheingabe",ANALYTICS:"Musikanalyse",CHARACTER_RELATIONS:"Charaktere und Beziehungen",VISUAL:"Visuelle Intelligenz",INTERRUPTION_CONTINUITY:"Unterbrechungen und Wiederaufnahme",RESEARCH:"Recherche und Lernen"};
const required={SOURCE_AND_PLUGIN_RELEASE_READBACK:6,SOURCE_IN_CURRENT:10,ISOLATED_ONLY:6,PROPOSAL_ONLY:1,PROVIDER_TASK_EXISTS:1,MIGRATION_NOT_DEPLOYED:1};
const human={SOURCE_AND_PLUGIN_RELEASE_READBACK:"Quellcode und Plugin-Fassung geprüft; Host-Wirkung separat offen",SOURCE_IN_CURRENT:"In LYVRAs Quellcode aufgenommen; reale Nutzung separat offen",ISOLATED_ONLY:"Separat gebaut; nativer Einbau fehlt",PROPOSAL_ONLY:"Noch nicht umgesetzt",PROVIDER_TASK_EXISTS:"Eigenständiger Dienst arbeitet; Anbindung offen",MIGRATION_NOT_DEPLOYED:"Geplanter Umbau noch nicht eingebaut"};
// R35: Ausgabekontinuität der bestehenden Semantic Visual Intelligence.
// "visuelle Führung" ist eine chatlokale Darstellungs-/Recovery-Anforderung,
// weder ein neuer Systemstart noch eine fremde Autorität oder produktive Aktion.
export const VISUAL_GUIDANCE_PHRASE="Visuelle Führung";
export function withNativeVisualGuidance(query) {
  if (typeof query!=="string" || !query.trim()) throw new TypeError("gültige Fortsetzungsanweisung erforderlich");
  if (/visuelle\s+führung/i.test(query)) return query;
  return query.trimEnd()+" Visuelle Führung: vorhandene LYVRA Semantic Visual Intelligence chatnativ verwenden und bei Darstellungsdrift wiederherstellen; native LifeCircle-/Facetten-Vererbung erhalten, keine HTML-Seite, keine Bildgenerierung, keine neue Engine.";
}
export function visualGuidanceRecoveryQuery() {
  return "LYVRA VISUELLE FÜHRUNG — Stelle im aktuellen Chat die bestehende native LYVRA Semantic Visual Intelligence aus dem frisch geprüften Whole-Current wieder her. Behalte aktuelle Facette, Arbeitsbereich, Rückkehrpunkte und LifeCircle bei. Keine neue Engine, kein Reset, keine produktiven Writes. Zeige die passenden echten Chat-Aktionen.";
}

function check(value,msg){if(!value)throw new TypeError(msg);}
export function projectNativeDeployment(view,{selection="ALL"}={}){
  check(view?.schema==="LYVRA_R32_CHAT_NATIVE_DEPLOYMENT_PROJECTION_V1","R32-Projektion unbestätigt");
  check(view.mode==="CHAT_NATIVE_DATA_NO_HTML"&&view.integrated_into_productive_native_host===false,"Quelle/Host inkonsistent");
  check(view.counts?.strands===6&&view.counts?.work_items===25&&view.counts?.bundles===7,"R30-Umfang geändert");
  check(view.counts.host_gates_open===18&&view.counts.host_gates_closed===0,"Host-Gates ohne Beleg geschlossen");
  check(Array.isArray(view.strands)&&view.strands.length===6&&SIX_STRANDS.every(id=>view.strands.some(x=>x.id===id)),"Sechs Stränge fehlen");
  check(new Set(view.strands.map(x=>x.id)).size===6,"Doppelte Strangkennung");
  check(view.strands.every(x=>x.host_acceptance?.closed===0&&x.host_acceptance?.total===3&&x.open_acceptance_gates?.length===3),"Gate-Nachweise verändert");
  check(Object.entries(required).every(([id,n])=>view.categories?.some(x=>x.id===id&&x.count===n)),"R30-Verteilung verändert");
  check(PAUSED_AREAS.every(x=>view.additional_preserved?.includes(x)),"Rückkehrpunkte fehlen");
  check(view.primary_return==="ANALYTICS","Analytics-Rückkehr verloren");
  check(selection==="ALL"||SIX_STRANDS.includes(selection),"Ungültiger Arbeitsbereich");
  return {
    owner:"WHOLE_LYVRA",surface:"EXISTING_SEMANTIC_CYBER_FIELD_VISUAL",mode:"CHAT_NATIVE_DATA_ONLY",
    status:"PARTIAL_READBACK_PENDING",source_anchor:view.source_anchor,
    indicators:{work_items:25,strands:6,bundles:7,host_gates_open:18,unintegrated:view.isolated_or_unintegrated.length},
    bars:view.categories.map(x=>({key:x.id,label:human[x.id],count:x.count,percent_of_items:100*x.count/25})),
    strands:view.strands.filter(x=>selection==="ALL"||x.id===selection).map(x=>({
      id:x.id,name:names[x.id],work_bundles:x.work_bundles,
      next_work:x.next_needed,open_gates:[...x.open_acceptance_gates],
      host_gates_verified:0,host_gates_total:3,development_percent:null,
      action_query:withNativeVisualGuidance("LYVRA PARALLEL R33 "+x.id+" WEITER — Frischen GitHub-Current prüfen, Originalfunktion sicher weiterbauen, Governance und Readback beachten. Andere Stränge erhalten.")
    })),
    backlog:view.isolated_or_unintegrated.map(x=>({id:x.id,area:x.bereich,missing:x.was_fehlt,source:x.source})),
    causal_relations:view.causal_relations.map(x=>({...x,write_granted:false})),
    paused:PAUSED_AREAS.map(id=>({id,status:"Erhalten, nicht automatisch aktiviert"})),
    observation_count:view.observation_count,quarantine_count:view.quarantine.length,
    glossary:view.human_dictionary,return_target:"ANALYTICS",
    overall_development_percent:null,productive_write_authorized:false,live_host_acceptance:false,
    all_action_query:withNativeVisualGuidance("LYVRA PARALLEL R34 ALLE STRÄNGE WEITER — R26–R33 erhalten, alle sechs Stränge mit echten nativen Einbauten weiterführen, keine Zusatzkosten, produktive Writes nur nach Governance und Readback."),
    visual_recovery_action_query:visualGuidanceRecoveryQuery()
  };
}


// R36: Vorhandene R32-Rueckstaende mit neuen Originalbelegen verknuepfen.
// Nur gerichtete Beobachtung, kein automatischer Native/ALIVE-Host-PASS oder Write.
export function reconcileDeploymentEvidence(view, receipts=[], {selection="ALL"}={}) {
  const base=projectNativeDeployment(view,{selection});
  check(Array.isArray(receipts),"Belege muessen eine Liste bilden");
  const items=new Map(view.isolated_or_unintegrated.map(x=>[x.id,x]));
  const seen=new Map(), accepted=[], quarantine=[];
  const allowed=new Set(["SOURCE_READBACK","LOCAL_EXECUTION","NATIVE_DEV_BRANCH_INTEGRATION","PRODUCTIVE_SOURCE_READBACK","HOST_OBSERVATION_PENDING","CONTRADICTION"]);
  for(const [index,rec] of receipts.entries()){
    const id=rec?.event_id, item=rec?.item_id, kind=rec?.kind, src=rec?.source_ref, claim=rec?.observation;
    if(![id,item,kind,src,claim].every(v=>typeof v==="string"&&v.trim())||!items.has(item)||!allowed.has(kind)){
      quarantine.push({index,reason:"Unbekannter oder unvollstaendiger Beleg",event_id:id??null});continue;
    }
    if(!/^(GitHub |R[0-9]+ archive |Local Node )/.test(src)){
      quarantine.push({index,reason:"Originalquellenverweis fehlt",event_id:id});continue;
    }
    const fingerprint=JSON.stringify([item,kind,src,claim]);
    if(seen.has(id)){
      quarantine.push({index,reason:seen.get(id)===fingerprint?"Doppelter Beleg":"Widerspruch: gleiche ID, anderer Inhalt",event_id:id});continue;
    }
    seen.set(id,fingerprint);
    accepted.push({event_id:id,item_id:item,kind,source_ref:src,observation:claim,
      scope:kind==="NATIVE_DEV_BRANCH_INTEGRATION"?"ISOLATED_NATIVE_CODE_ONLY":
      kind==="PRODUCTIVE_SOURCE_READBACK"?"PRODUCTIVE_SOURCE_ONLY":
      kind==="LOCAL_EXECUTION"?"LOCAL_TEST_ONLY":"OBSERVATION_ONLY",
      closes_host_gate:false});
  }
  const byItem=new Map();
  for(const event of accepted){if(!byItem.has(event.item_id))byItem.set(event.item_id,[]);byItem.get(event.item_id).push(event);}
  const backlog=base.backlog.map(item=>{
    const evidence=byItem.get(item.id)||[];
    return {...item,evidence_count:evidence.length,
      native_development_connected:evidence.some(e=>e.kind==="NATIVE_DEV_BRANCH_INTEGRATION"),
      productive_integration_verified:evidence.some(e=>e.kind==="PRODUCTIVE_SOURCE_READBACK"),
      host_verified:false,
      next_step:evidence.some(e=>e.kind==="NATIVE_DEV_BRANCH_INTEGRATION")?
        "Native Einbaukette pruefen, LifeCircle und Host erst nach direktem Readback freigeben":item.missing};
  });
  const bundles=view.bundles.map(b=>{
    const impacted=backlog.filter(x=>b.isolated_item_ids.includes(x.id));
    return {id:b.id,title:b.name,related_strands:[...b.affected_strands],
      open_candidates:impacted.length,
      native_dev_candidates:impacted.filter(x=>x.native_development_connected).length,
      productive_source_candidates:impacted.filter(x=>x.productive_integration_verified).length,
      host_accepted:0};
  });
  return {...base,backlog,bundles,observations:accepted,quarantine,
    observation_count:accepted.length,quarantine_count:quarantine.length,
    integration_alerts:backlog.filter(x=>x.native_development_connected&&!x.productive_integration_verified).map(x=>x.id),
    strands:base.strands.map(s=>({...s,
      evidence_items:backlog.filter(x=>bundles.some(b=>b.related_strands.includes(s.id)&&b.open_candidates>0&&view.bundles.find(z=>z.id===b.id)?.isolated_item_ids.includes(x.id))).map(x=>x.id),
      action_query:withNativeVisualGuidance(s.action_query)
    })),
    all_action_query:withNativeVisualGuidance(base.all_action_query),
    live_host_acceptance:false,productive_write_authorized:false,
    overall_development_percent:null,
    evidence_limitation:"Entwicklungsbranch und lokale Tests sind keine produktive Chat-Host-Ausfuehrung"};
}
