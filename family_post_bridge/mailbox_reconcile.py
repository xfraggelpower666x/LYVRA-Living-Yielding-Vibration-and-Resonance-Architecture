"""Pure, read-only family mailbox reconciliation for independently authorized Drive clients.

Does NOT access Google Drive, run in the background, authorize a sender or send a letter.
The caller must provide the actual list of files and (where available) verified
message IDs read from document content. Missing evidence remains unverified.
"""
from collections import Counter


def reconcile_mailbox(entries, *, known_revisions=None, answered_message_ids=None):
    """Return conservative review decisions without changing durable state.

    entries: iterable of {file_id, revision, message_id, is_incoming}
    known_revisions: mapping file_id -> revision last explicitly reviewed
    answered_message_ids: message IDs with independently verified answer evidence

    A new file or changed revision is a REVIEW candidate, never proof of human unread.
    An 'answered' label requires an explicitly supplied evidence-backed message ID.
    """
    known_revisions = known_revisions or {}
    answered_message_ids = set(answered_message_ids or ())
    entries = list(entries)
    counts = Counter(e.get('message_id') for e in entries if e.get('message_id'))
    result = []
    for e in entries:
        file_id, rev, mid = e.get('file_id'), e.get('revision'), e.get('message_id')
        if not file_id or e.get('is_incoming') not in (True, False):
            result.append({'file_id': file_id, 'state': 'NEEDS_METADATA_REVIEW'})
        elif e['is_incoming'] is False:
            result.append({'file_id': file_id, 'state': 'OUTGOING_NOT_INBOX'})
        elif not mid:
            result.append({'file_id': file_id, 'state': 'NEEDS_ID_REVIEW'})
        elif counts[mid] > 1:
            result.append({'file_id': file_id, 'state': 'DUPLICATE_ID_REVIEW', 'message_id': mid})
        elif mid in answered_message_ids:
            result.append({'file_id': file_id, 'state': 'ANSWER_EVIDENCE_PRESENT', 'message_id': mid})
        elif file_id in known_revisions and known_revisions[file_id] == rev and rev is not None:
            result.append({'file_id': file_id, 'state': 'REVISION_ALREADY_REVIEWED', 'message_id': mid})
        else:
            result.append({'file_id': file_id, 'state': 'NEW_OR_CHANGED_NEEDS_REVIEW', 'message_id': mid})
    return result
