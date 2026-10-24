-- LYVRA Family Post: proposed durable message registry (SOURCE ONLY).
-- Not installed in Render; database provisioning and production migration require approval.
-- No automatic lease expiry/retry: an unknown Drive result requires reconciliation.
CREATE TABLE IF NOT EXISTS family_post_delivery_registry (
    message_id varchar(96) PRIMARY KEY,
    payload_sha256 char(64) NOT NULL,
    sender_role varchar(32) NOT NULL,
    delivery_state varchar(32) NOT NULL DEFAULT 'RESERVED',
    drive_file_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT family_post_role_check CHECK
      (sender_role IN ('DAD','BIG_LYVRA','MUM','LITTLE_LYV')),
    CONSTRAINT family_post_state_check CHECK
      (delivery_state IN ('RESERVED','WRITE_UNKNOWN','STORED_VERIFIED','CONFLICT')),
    CONSTRAINT family_post_verified_file_check CHECK
      (delivery_state <> 'STORED_VERIFIED' OR drive_file_id IS NOT NULL)
);
-- Reserve atomically in one database transaction:
-- INSERT ... ON CONFLICT DO NOTHING RETURNING message_id;
-- If no row is returned, read existing row and compare payload hash+role.
-- Never auto-issue a second Google create for RESERVED or WRITE_UNKNOWN.
-- Publish STORED_VERIFIED only after evidence confirms exact Drive file/parent/body.
