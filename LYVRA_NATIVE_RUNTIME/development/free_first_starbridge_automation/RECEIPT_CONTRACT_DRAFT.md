# Safe first receiver contract (draft)

This is a design/staging document, not operational permission.

```json
{
  "event_id": "<verified stable ID>",
  "sender": {"native_system": "LYVRA", "repo": "<exact>", "branch": "<exact>"},
  "receiver": {"native_system": "<recipient>", "repo": "<recipient's native repo>"},
  "source": {"path": "<exact>", "commit_sha": "<40 hex>", "blob_sha": "<40 hex>"},
  "kind": "DEVELOPMENT_EVIDENCE_NOTICE",
  "permission_scope": "READ_ONLY_NATIVE_REVIEW",
  "evidence_grade": "VERIFIED_DIRECT_READBACK",
  "source_status": "SOURCE_ONLY",
  "delivery_status": "NOT_VERIFIED",
  "adoption_status": "NOT_VERIFIED",
  "host_status": "NOT_VERIFIED"
}
```

Delivery can be promoted only after an independent receiver-native record, exact current authority and matching original source blob/commit. The sender's booleans and search snippets do not suffice. Receipt verification remains read-only unless the native target independently authorizes a receipt write. Host execution requires a real injected authorized host handle plus logs/readback, never just a plugin skill or metadata listing.

Same `event_id + source blob + native recipient` must not create repeated work. A source blob change requires a new event or supersession; conflicting same-ID content quarantines instead of overwriting. Invalid permission or unresolved costs STOP safely. Preserve all newer valid development.
