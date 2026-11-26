// Kostenentscheidung für die konkrete Aktion; keine globale Entwicklungssperre.
const LOCAL=new Set(['LOCAL_DESIGN','LOCAL_CODE','OFFLINE_TEST','DOCUMENTATION']);
export function assessCost(operation,evidence={}){
  if(LOCAL.has(operation)) return {allowed:true,code:'LOCAL_NO_EXTERNAL_CHARGE'};
  if(operation==='SOURCE_PUBLICATION') return evidence.sourceOnly===true&&evidence.meteredSideEffectsExcluded===true ? {allowed:true,code:'SOURCE_ONLY_NO_METERED_SIDE_EFFECTS'}:{allowed:false,code:'PUBLICATION_SIDE_EFFECTS_UNRESOLVED'};
  if(operation==='REMOTE_READBACK') return evidence.operationBound===true&&evidence.entitlementVerified===true&&evidence.noAdditionalCharge===true ? {allowed:true,code:'OPERATION_COST_COVERED'}:{allowed:false,code:'REMOTE_COST_RISK_UNRESOLVED'};
  return {allowed:false,code:'UNKNOWN_OR_CHARGE_BEARING_OPERATION'};
}
