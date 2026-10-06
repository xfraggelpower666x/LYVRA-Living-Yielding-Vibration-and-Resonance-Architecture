# LYVRA Pet Browser Deployment Guard

Status: PREPARED / NOT_DEPLOYED

Purpose: deploy the Pet as an independent browser surface without changing LYVRA main-plugin availability.

Rules:
- no main-plugin MCP binding
- no plugin release mutation
- no WEBLyvra mutation
- no custom-domain mutation without explicit authorization
- no paid Cloudflare feature
- no secrets in repository
- FREE_ONLY = TRUE
- deployment requires separate explicit authorization and post-deploy readback

Prepared Worker name: `lyvra-pet-browser`

This file is not deployment evidence.
