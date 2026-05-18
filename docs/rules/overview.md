---
title: Overview
description: Overview of stylelint-plugin-css-performance-budget and its package surface.
---

# stylelint-plugin-css-performance-budget

`stylelint-plugin-css-performance-budget` provides focused Stylelint guardrails for CSS rendering cost.

## What it checks

- heavy selectors
- giant selector lists
- excessive filter/backdrop stacks and blur radii
- expensive transition and keyframe property targets
- broad or risky will-change usage
- layout-thrashing properties
- paint-heavy declarations

## Package exports

- default plugin pack export
- `performanceBudgetPluginConfigs`
  - `performance-budget-recommended`
  - `performance-budget-all`
  - `performance-budget-strict`

## Rule philosophy

Recommended mode aims for low-noise defaults. The all/strict profiles include broader enforcement for teams that want tighter budgets.
