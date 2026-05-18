---
title: 🛡️ performance-budget-strict
description: Strict CSS performance budget rule profile.
---

# 🛡️ performance-budget-strict

Strict profile currently matching `performance-budget-all` for explicit policy signaling.

Use this preset when review policy should say "strict" even while the current
coverage intentionally matches
[🟣 performance-budget-all](./performance-budget-all.md). For lower-noise
adoption, start with
[🟢 performance-budget-recommended](./performance-budget-recommended.md).

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule | Fix | Description |
| --- | :-: | --- |
| [`no-excessive-filter-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-excessive-filter-effects) | — | Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii. |
| [`no-expensive-animation-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-animation-properties) | — | Warn on expensive animation and transition targets, including `transition: all` and costly keyframe properties. |
| [`no-expensive-positioning-patterns`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-positioning-patterns) | — | Warn when fixed or sticky positioned rules also apply expensive paint effects. |
| [`no-fixed-background-attachment`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-fixed-background-attachment) | — | Warn on fixed background attachment patterns that commonly cause expensive scroll repaints. |
| [`no-giant-selector-lists`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-giant-selector-lists) | — | Warn when one rule contains an oversized comma-separated selector list. |
| [`no-global-expensive-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-global-expensive-effects) | — | Warn when paint-heavy effects are applied to broad global selectors. |
| [`no-heavy-selectors`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-heavy-selectors) | — | Warn when selector complexity exceeds a configurable performance budget. |
| [`no-layout-thrashing-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-layout-thrashing-properties) | — | Warn on declarations that commonly trigger layout/reflow work in the rendering pipeline. |
| [`no-oversized-css-custom-property-values`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-oversized-css-custom-property-values) | — | Warn when custom properties hide oversized shadow, filter, or gradient values. |
| [`no-paint-heavy-declarations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-paint-heavy-declarations) | — | Warn on declaration properties that are typically expensive for paint/compositing. |
| [`no-render-blocking-import`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-render-blocking-import) | — | Warn on CSS `@import` rules that can block stylesheet rendering. |
| [`no-will-change-abuse`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-will-change-abuse) | — | Warn when will-change is overly broad, uses risky keywords, or targets expensive properties. |
| [`require-reduced-motion-for-expensive-animations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/require-reduced-motion-for-expensive-animations) | — | Require a `prefers-reduced-motion: reduce` override when expensive transition or keyframe properties are used. |
