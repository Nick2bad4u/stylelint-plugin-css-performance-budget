---
title: Docs Site Contract
description: Source-of-truth rules for maintaining the Docusaurus documentation app in this repository.
---

# Docs Site Contract

## Hand-authored content

- `docs/rules/**`
- `docs/docusaurus/site-docs/**`
- `docs/docusaurus/src/**`
- Docusaurus config and sidebar files

## Generated content

- `docs/docusaurus/site-docs/developer/api/**`
- `docs/docusaurus/build/**`
- generated inspector output under `docs/docusaurus/static/*-inspector/**`

## Update workflow

1. Update authored source.
2. Run sync/generation scripts.
3. Run docs typecheck/link checks.
