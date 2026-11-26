"""Lesende Suno-Checkpoint-Übergabe; keine Provider- oder Repository-Writes."""
import hashlib
import json
import re
from copy import deepcopy

REPO = 'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture'

def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
        separators=(',', ':'), allow_nan=False).encode('utf-8')).hexdigest()

def handoff(data, *, project, track, route, restore, read_head, current):
    """Originalvalidator und autorisierten, ausschließlich lesenden Host injizieren.
    current ist der unabhängig bekannte Track-Stand; None erlaubt keinen Current-Pass.
    """
    before = read_head('lyvra')
    if not isinstance(before, str) or not re.fullmatch('[a-f0-9]{40}', before):
        raise ValueError('READBACK_PENDING: ungültiger HEAD')
    result = restore(deepcopy(data), project, track, route,
                     expected_source_ref=before, current=deepcopy(current))
    after = read_head('lyvra')
    if before != after:
        raise ValueError('CONFLICT_QUARANTINE: HEAD_MOVED')
    ready = (current is not None and result['source_binding'] == 'MATCHED_SUPPLIED_REF'
             and result['route_status'] == 'FIELDS_VALIDATED'
             and not result['evidence_context_gaps'])
    return {'schema':'lyvra-suno-evidence-handoff-v1', 'repository':REPO,
            'branch':'lyvra', 'source_ref':before, 'project_id':project,
            'track_id':track, 'revision':data['revision'], 'route':route,
            'checkpoint_sha256':digest(data), 'validation_sha256':digest(result),
            'source_binding':result['source_binding'], 'route_status':result['route_status'],
            'route_reason':result['route_reason'], 'utf16':result['utf16'],
            'evidence_context_gaps':result['evidence_context_gaps'],
            'status':'VALIDATED_HANDOFF' if ready else 'READBACK_PENDING',
            'write_authority':False, 'provider_execution':False,
            'host_receipt':'CALLER_SUPPLIED_READS_NOT_INDEPENDENT_ATTESTATION'}
