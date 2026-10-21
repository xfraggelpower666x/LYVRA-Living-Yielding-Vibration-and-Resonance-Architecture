"""SCRI workflow trust audit. Read-only classifications, never protection claims."""
from pathlib import Path

def audit(workflow):
    lines=workflow.splitlines()
    token_read=any(line.strip()=="contents: read" for line in lines)
    scoped=any(line.strip()=="if: github.ref == 'refs/heads/lyvra-scri-candidate-20261020'" for line in lines)
    checkout_no_creds=any(line.strip()=="persist-credentials: false" for line in lines)
    unpinned_actions=[line.strip() for line in lines if "uses:" in line and "@v" in line]
    risky=[line.strip() for line in lines if any(t in line for t in ("pull_request_target:", "permissions: write-all", "contents: write", "id-token: write"))]
    return {"declared_token_read_only":token_read,
            "branch_scoped_job":scoped,
            "checkout_does_not_persist_credentials":checkout_no_creds,
            "mutable_major_version_action_refs":unpinned_actions,
            "risky_workflow_directives":risky,
            "repo_permission_enforcement_verified":False,
            "branch_protection_verified":False,
            "external_code_immutability_verified":False,
            "runner_process_integrity_verified":False,
            "ref_history_continuity_verified":False,
            "action":"NONE","restore_approved":False}
