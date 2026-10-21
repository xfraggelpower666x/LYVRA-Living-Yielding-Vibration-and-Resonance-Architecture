"""Public SCRI supersession gate is non-decisional. Use Git-bound assess()."""
def _blocked(*args,**kwargs):
 return {"status":"UNBOUND_DIRECT_CALL_BLOCKED","action":"NONE",
         "restore_approved":False,"semantic_supersession_verified":False}
def judge(pointer,handoff,pet,deployment,source_commit):
 return _blocked()
def _evaluate_verified_carriers(*args,**kwargs):
 return _blocked()
