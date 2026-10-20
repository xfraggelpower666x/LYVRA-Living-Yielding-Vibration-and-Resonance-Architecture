"""SCRI isolated evidence model: source-root deduplication, conflicts and multi-cause caution.
Root independence and revision freshness are declared fixture attributes, not independently proven.
No production mutation, repair, rollback, or new decision authority.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class Record:
    claim: str
    root: str
    report: str
    supports: frozenset = frozenset()
    rebuts: frozenset = frozenset()
    verified: bool = True
    current: bool = True

@dataclass(frozen=True)
class Memory:
    identifier: str
    origin: str
    source_revision: str
    explanation: str
    hypotheses: frozenset

def assess(memories, evidence, current_revision):
    valid = [m for m in memories if m.origin and m.explanation and m.source_revision == current_revision]
    stale = sorted(m.identifier for m in memories if m.source_revision != current_revision)
    ungrounded = sorted(m.identifier for m in memories if not m.origin or not m.explanation)
    available = set().union(*(m.hypotheses for m in valid)) if valid else set()
    good = [r for r in evidence if r.verified and r.current and r.root and r.report]
    quarantined = sorted(r.report for r in evidence if r not in good)
    support = {h: set() for h in available}
    rebut = {h: set() for h in available}
    roots = {}
    for r in good:
        roots.setdefault(r.root, []).append(r.report)
        for h in r.supports & available:
            support[h].add(r.root)
        for h in r.rebuts & available:
            rebut[h].add(r.root)
    candidates = sorted(h for h in available if support[h] and not rebut[h])
    conflicts = sorted(h for h in available if support[h] and rebut[h])
    status = ('EVIDENCE_CONFLICT' if conflicts else
              'MULTIPLE_CAUSES_OR_AMBIGUITY' if len(candidates) > 1 else
              'INVESTIGATE_ONLY' if candidates else 'INSUFFICIENT_EVIDENCE')
    return dict(status=status, candidates=candidates, contested=conflicts,
                support_roots={h: sorted(v) for h,v in sorted(support.items())},
                rebut_roots={h: sorted(v) for h,v in sorted(rebut.items())},
                duplicated_reports={root: sorted(reports) for root, reports in roots.items() if len(reports)>1},
                stale_memories=stale, ungrounded_memories=ungrounded,
                quarantined_reports=quarantined,
                preserved=['whole_lyvra','track_design','studio_2','newer_valid_evolution'],
                action='NONE',
                limitations='Source root independence and revision validity require external verification')
