---
title: 🟣 performance-budget-all
description: Full CSS performance budget rule profile.
---

# 🟣 performance-budget-all

Enables the complete public rule catalog.

Use this preset for complete coverage. If you want the same current rule
coverage under an explicitly stricter policy name, use
[🛡️ performance-budget-strict](./performance-budget-strict.md). For lower-noise
rollout, start with
[🟢 performance-budget-recommended](./performance-budget-recommended.md).

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule                                                                                                                                                                                 | Fix | Description                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | -------------------------------------------------------------------------------------------------------------- |
| [`no-excessive-filter-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-excessive-filter-effects)                                         |  —  | Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii.                 |
| [`no-expensive-animation-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-animation-properties)                             |  —  | Warn on `transition: all` and transitions or keyframes that target high-cost paint effects.                    |
| [`no-expensive-positioning-patterns`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-positioning-patterns)                             |  —  | Warn when fixed or sticky positioned rules also apply expensive paint effects.                                 |
| [`no-fixed-background-attachment`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-fixed-background-attachment)                                   |  —  | Warn on fixed background attachment patterns that commonly cause expensive scroll repaints.                    |
| [`no-giant-selector-lists`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-giant-selector-lists)                                                 |  —  | Warn when one rule contains an oversized comma-separated selector list.                                        |
| [`no-global-expensive-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-global-expensive-effects)                                         |  —  | Warn when paint-heavy effects are applied to broad global selectors.                                           |
| [`no-heavy-selectors`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-heavy-selectors)                                                           |  —  | Warn when selector complexity exceeds a configurable performance budget.                                       |
| [`no-layout-thrashing-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-layout-thrashing-properties)                                   |  —  | Warn when transitions or keyframes target layout-affecting properties.                                         |
| [`no-oversized-css-custom-property-values`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-oversized-css-custom-property-values)                 |  —  | Warn when custom properties hide oversized shadow, filter, or gradient values.                                 |
| [`no-paint-heavy-declarations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-paint-heavy-declarations)                                         |  —  | Warn on declarations whose values exceed paint/compositing budgets.                                            |
| [`no-render-blocking-import`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-render-blocking-import)                                             |  —  | Warn on CSS `@import` rules that can block stylesheet rendering.                                               |
| [`no-will-change-abuse`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-will-change-abuse)                                                       |  —  | Warn when will-change is overly broad, uses risky keywords, or targets expensive properties.                   |
| [`require-reduced-motion-for-expensive-animations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/require-reduced-motion-for-expensive-animations) |  —  | Require a `prefers-reduced-motion: reduce` override when expensive transition or keyframe properties are used. |
