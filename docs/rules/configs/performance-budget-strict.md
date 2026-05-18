---
title: performance-budget-strict
description: Strict CSS performance budget rule profile.
---

# performance-budget-strict

Strict profile currently matching `performance-budget-all` for explicit policy signaling.

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule | Fix | Description |
| --- | :-: | --- |
| [`no-excessive-filter-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-excessive-filter-effects) | — | Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii. |
| [`no-expensive-animation-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-animation-properties) | — | Warn on expensive animation and transition targets, including `transition: all` and costly keyframe properties. |
| [`no-giant-selector-lists`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-giant-selector-lists) | — | Warn when one rule contains an oversized comma-separated selector list. |
| [`no-heavy-selectors`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-heavy-selectors) | — | Warn when selector complexity exceeds a configurable performance budget. |
| [`no-layout-thrashing-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-layout-thrashing-properties) | — | Warn on declarations that commonly trigger layout/reflow work in the rendering pipeline. |
| [`no-paint-heavy-declarations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-paint-heavy-declarations) | — | Warn on declaration properties that are typically expensive for paint/compositing. |
| [`no-will-change-abuse`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-will-change-abuse) | — | Warn when will-change is overly broad, uses risky keywords, or targets expensive properties. |
