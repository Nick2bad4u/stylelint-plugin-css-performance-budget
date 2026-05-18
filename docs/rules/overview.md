---
title: Overview
description: Overview of stylelint-plugin-css-performance-budget and its package surface.
---

# stylelint-plugin-css-performance-budget

`stylelint-plugin-css-performance-budget` provides focused Stylelint guardrails for CSS rendering cost.

## Start Here

- New setup: [Getting Started](./getting-started.md)
- Config comparison: [Config Matrix](./configs/index.md)
- Low-noise preset: [🟢 performance-budget-recommended](./configs/performance-budget-recommended.md)
- Strict preset: [🛡️ performance-budget-strict](./configs/performance-budget-strict.md)
- Full audit preset: [🟣 performance-budget-all](./configs/performance-budget-all.md)

## What it checks

- [heavy selectors](./no-heavy-selectors.md)
- [giant selector lists](./no-giant-selector-lists.md)
- [render-blocking CSS imports](./no-render-blocking-import.md)
- [excessive filter/backdrop stacks and blur radii](./no-excessive-filter-effects.md)
- [expensive transition and keyframe property targets](./no-expensive-animation-properties.md)
- [expensive fixed/sticky positioning patterns](./no-expensive-positioning-patterns.md)
- [fixed background attachment](./no-fixed-background-attachment.md)
- [global expensive effects](./no-global-expensive-effects.md)
- [oversized performance-sensitive custom property values](./no-oversized-css-custom-property-values.md)
- [reduced-motion coverage for expensive motion](./require-reduced-motion-for-expensive-animations.md)
- [broad or risky will-change usage](./no-will-change-abuse.md)
- [layout-thrashing properties](./no-layout-thrashing-properties.md)
- [paint-heavy declarations](./no-paint-heavy-declarations.md)

## Package exports

- default plugin pack export
- `performanceBudgetPluginConfigs`
  - 🟢 `performance-budget-recommended`
  - 🟣 `performance-budget-all`
  - 🛡️ `performance-budget-strict`

## Rule philosophy

🟢 Recommended mode aims for low-noise defaults. 🟣 All and 🛡️ strict profiles
include broader enforcement for teams that want tighter budgets.

Use the [config matrix](./configs/index.md#Config-Matrix) to compare rule coverage before enabling a stricter profile.
