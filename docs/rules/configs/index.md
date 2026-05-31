---
title: Configs
description: Shareable Stylelint configs exported by stylelint-plugin-css-performance-budget.
---

# Configs

`stylelint-plugin-css-performance-budget` exports these shareable configs:

- [🟢 `performance-budget-recommended`](./performance-budget-recommended.md)
- [🛡️ `performance-budget-strict`](./performance-budget-strict.md)
- [🟣 `performance-budget-all`](./performance-budget-all.md)

Use them from `performanceBudgetPluginConfigs` or from `extends` subpath exports.

Start with [Getting Started](../getting-started.md) if you have not wired the
plugin into Stylelint yet, or jump to the [rule overview](../overview.md) for
rule-by-rule rollout guidance.

## Config Matrix

| Rule                                                                                                       | 🟢 Recommended | 🛡️ Strict | 🟣 All |
| ---------------------------------------------------------------------------------------------------------- | :------------: | :-------: | :----: |
| [`no-excessive-filter-effects`](../no-excessive-filter-effects.md)                                         |      Yes       |    Yes    |  Yes   |
| [`no-expensive-animation-properties`](../no-expensive-animation-properties.md)                             |      Yes       |    Yes    |  Yes   |
| [`no-expensive-positioning-patterns`](../no-expensive-positioning-patterns.md)                             |       No       |    Yes    |  Yes   |
| [`no-fixed-background-attachment`](../no-fixed-background-attachment.md)                                   |      Yes       |    Yes    |  Yes   |
| [`no-giant-selector-lists`](../no-giant-selector-lists.md)                                                 |       No       |    Yes    |  Yes   |
| [`no-global-expensive-effects`](../no-global-expensive-effects.md)                                         |      Yes       |    Yes    |  Yes   |
| [`no-heavy-selectors`](../no-heavy-selectors.md)                                                           |       No       |    Yes    |  Yes   |
| [`no-layout-thrashing-properties`](../no-layout-thrashing-properties.md)                                   |      Yes       |    Yes    |  Yes   |
| [`no-oversized-css-custom-property-values`](../no-oversized-css-custom-property-values.md)                 |       No       |    Yes    |  Yes   |
| [`no-paint-heavy-declarations`](../no-paint-heavy-declarations.md)                                         |      Yes       |    Yes    |  Yes   |
| [`no-render-blocking-import`](../no-render-blocking-import.md)                                             |      Yes       |    Yes    |  Yes   |
| [`no-will-change-abuse`](../no-will-change-abuse.md)                                                       |      Yes       |    Yes    |  Yes   |
| [`require-reduced-motion-for-expensive-animations`](../require-reduced-motion-for-expensive-animations.md) |       No       |    Yes    |  Yes   |

🟢 `performance-budget-recommended` is the low-noise adoption path. 🛡️
`performance-budget-strict` currently mirrors 🟣 `performance-budget-all` so
teams can opt into an explicitly strict policy name without changing rule
coverage later.

## Related Pages

- [🟢 Recommended config](./performance-budget-recommended.md)
- [🛡️ Strict config](./performance-budget-strict.md)
- [🟣 All rules config](./performance-budget-all.md)
- [Rule overview](../overview.md)
