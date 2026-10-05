# LYVRA PET Cloudflare Zero-Cost Policy

Hard requirement: no additional Cloudflare costs.

Allowed:
- Workers Free
- static assets on free hosting surfaces
- free quotas only

Forbidden without a new explicit user decision:
- Workers Paid activation
- paid Durable Objects usage
- paid Workflows usage
- paid external APIs or storage
- any automatic plan upgrade
- any feature that can silently create billable overage

Runtime behavior at a free-tier limit:
- fail closed
- return LIMIT_REACHED / BLOCKED
- do not upgrade
- do not switch to a paid service

This policy belongs to the Pet runtime and must travel with every deployment.
