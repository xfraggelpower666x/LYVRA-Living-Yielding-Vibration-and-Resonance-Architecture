"""Isolated read-only causal carrier ledger. Claims stay claims; no automatic promotion."""
def evaluate(pointer, handoff, guard, deployment, commits):
    state=pointer["current_known_whole_state"]
    track_now=state["track_design_logical_revision"]
    track_then=handoff["track_logical_revision"]
    separate="STUDIO2_NE_TRACK_DESIGN_CHILD_FACET = true" in guard
    output={
      "whole":{"authority":"LYVRA","status":"CURRENT_CARRIER_OBSERVED",
               "current_head":commits["prod"],"recovery_approved":False},
      "track":{"status":"OLDER_HANDOFF_EVIDENCE" if track_then<track_now else "REVIEW",
               "current_revision":track_now,"handoff_revision":track_then,
               "preserve_version":state["track_design_version"],"recovery_approved":False},
      "studio2":{"status":"SEPARATE_FACET_REVIEW" if separate else "BOUNDARY_UNVERIFIED",
                 "no_track_scope_transfer":separate,"recovery_approved":False},
      "deployment":{"claim":deployment.get("deployment_status"),
                    "live_verified":False},
      "checkpoints":{"status":"DO_NOT_REOPEN_WITHOUT_NEW_CURRENT_EVIDENCE"},
      "git":{"prod_commit":commits["prod"],"dev_commit":commits["dev"],
             "ancestry_observed":commits.get("ancestry_observed",False),
             "semantic_supersession_proven":False},
      "action":"NONE"}
    return output
