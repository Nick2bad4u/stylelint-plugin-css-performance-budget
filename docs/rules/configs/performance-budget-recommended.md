---
title: 🟢 performance-budget-recommended
description: Recommended low-noise CSS performance budget rules.
---

# 🟢 performance-budget-recommended

Low-noise default profile for most codebases.

Use this preset as the first adoption step before moving to
[🛡️ performance-budget-strict](./performance-budget-strict.md) or auditing every
rule with [🟣 performance-budget-all](./performance-budget-all.md).

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule                                                                                                                                                     | Fix | Description                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | ---------------------------------------------------------------------------------------------- |
| [`no-excessive-filter-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-excessive-filter-effects)             |  —  | Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii. |
| [`no-expensive-animation-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-animation-properties) |  —  | Warn on `transition: all` and transitions or keyframes that target high-cost paint effects.    |
| [`no-fixed-background-attachment`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-fixed-background-attachment)       |  —  | Warn on fixed background attachment patterns that commonly cause expensive scroll repaints.    |
| [`no-global-expensive-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-global-expensive-effects)             |  —  | Warn when paint-heavy effects are applied to broad global selectors.                           |
| [`no-layout-thrashing-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-layout-thrashing-properties)       |  —  | Warn when transitions or keyframes target layout-affecting properties.                         |
| [`no-render-blocking-import`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-render-blocking-import)                 |  —  | Warn on CSS `@import` rules that can block stylesheet rendering.                               |
| [`no-will-change-abuse`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-will-change-abuse)                           |  —  | Warn when will-change is overly broad, uses risky keywords, or targets expensive properties.   |
