from family_post_bridge.mailbox_reconcile import reconcile_mailbox


def test_new_requires_review_not_claimed_unread():
    assert reconcile_mailbox([dict(file_id='a', revision='v1', message_id='m1', is_incoming=True)])[0]['state'] == 'NEW_OR_CHANGED_NEEDS_REVIEW'


def test_reviewed_revision_not_realerted():
    assert reconcile_mailbox([dict(file_id='a', revision='v1', message_id='m1', is_incoming=True)], known_revisions={'a':'v1'})[0]['state'] == 'REVISION_ALREADY_REVIEWED'


def test_changed_revision_reappears():
    assert reconcile_mailbox([dict(file_id='a', revision='v2', message_id='m1', is_incoming=True)], known_revisions={'a':'v1'})[0]['state'] == 'NEW_OR_CHANGED_NEEDS_REVIEW'


def test_unknown_id_stays_uncertain():
    assert reconcile_mailbox([dict(file_id='a', revision='v1', is_incoming=True)])[0]['state'] == 'NEEDS_ID_REVIEW'


def test_duplicate_ids_fail_closed():
    entries=[dict(file_id=str(i), revision='v1', message_id='m1', is_incoming=True) for i in range(2)]
    assert all(e['state']=='DUPLICATE_ID_REVIEW' for e in reconcile_mailbox(entries))


def test_answer_requires_supplied_evidence():
    entries=[dict(file_id='a', revision='v1', message_id='m1', is_incoming=True)]
    assert reconcile_mailbox(entries,answered_message_ids={'m1'})[0]['state']=='ANSWER_EVIDENCE_PRESENT'


def test_outgoing_not_new_mail():
    assert reconcile_mailbox([dict(file_id='a', revision='v1', message_id='m1', is_incoming=False)])[0]['state']=='OUTGOING_NOT_INBOX'


def test_missing_metadata_needs_review():
    assert reconcile_mailbox([dict(revision='v1', message_id='m1', is_incoming=True)])[0]['state']=='NEEDS_METADATA_REVIEW'
