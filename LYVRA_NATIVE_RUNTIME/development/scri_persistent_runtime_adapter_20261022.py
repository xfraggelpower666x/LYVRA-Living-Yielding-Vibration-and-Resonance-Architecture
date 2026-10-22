"""Isolated, explicit-path SCRI persistent memory adapter. No native service activation."""
from dataclasses import asdict
from pathlib import Path
import json,os,tempfile,fcntl
from scri_causal_chain_adapter_20261021 import Memory,derive,recall,revise

def _check(facet):
    if not isinstance(facet,str) or not facet or len(facet)>120 or not all(c.isalnum() or c in "_-" for c in facet):
        raise ValueError("invalid facet")

def load(path,facet):
    _check(facet)
    p=Path(path)
    if not p.is_file():return None
    if p.is_symlink():raise ValueError("symlink forbidden")
    try:
        data=json.loads(p.read_text(encoding="utf8"))
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise ValueError("corrupted memory: do not overwrite") from error
    if not isinstance(data,dict) or set(data)!={"schema","facet","memory"}:
        raise ValueError("invalid memory envelope: do not overwrite")
    if type(data["schema"]) is not int or data["schema"]!=1 or data["facet"]!=facet:
        raise ValueError("schema or facet mismatch")
    mem=data.get("memory")
    if mem is None:return None
    if not isinstance(mem,dict) or set(mem)!={"facet","relation","sources","runs","revision","status","counter_sources"} or mem["facet"]!=facet:
        raise ValueError("invalid memory")
    if not isinstance(mem["relation"],list) or len(mem["relation"])!=2 or not all(isinstance(x,str) and x for x in mem["relation"]):
        raise ValueError("invalid relation")
    if not isinstance(mem["revision"],int) or isinstance(mem["revision"],bool) or mem["revision"]<1 or mem["status"] not in ("PROVISIONAL","COUNTEREVIDENCE"):
        raise ValueError("invalid revision")
    for key in ("sources","runs","counter_sources"):
        if not isinstance(mem[key],list) or not all(isinstance(s,str) and s for s in mem[key]):raise ValueError("invalid evidence")
    return Memory(facet,tuple(mem["relation"]),tuple(mem["sources"]),tuple(mem["runs"]),mem["revision"],mem["status"],tuple(mem["counter_sources"]))

def store(path,facet,memory):
    _check(facet)
    if memory is not None and memory.facet!=facet:raise ValueError("cross-facet write")
    p=Path(path)
    if p.is_symlink():raise ValueError("symlink forbidden")
    p.parent.mkdir(parents=True,exist_ok=True)
    payload={"schema":1,"facet":facet,"memory":asdict(memory) if memory else None}
    temp=None
    try:
        with tempfile.NamedTemporaryFile(mode="w",encoding="utf8",dir=p.parent,delete=False) as f:
            temp=f.name
            json.dump(payload,f,sort_keys=True)
            f.flush();os.fsync(f.fileno())
        os.replace(temp,p)
    finally:
        if temp and os.path.exists(temp):os.unlink(temp)

def _process_locked(path,facet,events):
    """Explicit invocation, no background worker; same-facet events supplied by caller."""
    _check(facet)
    prior=load(path,facet)
    if prior is None:
        memory=derive(events,facet)
        if memory is not None:store(path,facet,memory)
        return {"memory":memory,"decision":recall(memory,events,facet) if memory else {"status":"ABSTAIN","candidate":None,"action":"NONE"}}
    memory=revise(prior,events)
    if memory!=prior:store(path,facet,memory)
    return {"memory":memory,"decision":recall(memory,events,facet)}


def process_scoped(root,facet,events):
    """Candidate-only scoped entry: allocate a stable facet-owned path inside caller-owned root.

    This is NOT a native service, event subscription, or permission grant.
    """
    _check(facet)
    root=Path(root)
    if root.is_symlink():raise ValueError("symlink root forbidden")
    root.mkdir(parents=True,exist_ok=True)
    return process(root / (facet + ".json"),facet,events)


def process(path,facet,events):
    """Serialize explicit same-path read/modify/write across cooperating processes."""
    _check(facet)
    events=tuple(events)
    lock=Path(str(path)+".lock")
    lock.parent.mkdir(parents=True,exist_ok=True)
    if lock.is_symlink():raise ValueError("symlink lock forbidden")
    flags=os.O_CREAT|os.O_RDWR
    if hasattr(os,"O_NOFOLLOW"):flags|=os.O_NOFOLLOW
    fd=os.open(lock,flags,0o600)
    try:
        with os.fdopen(fd,"r+") as file:
            fcntl.flock(file.fileno(),fcntl.LOCK_EX)
            return _process_locked(path,facet,events)
    finally:
        pass
