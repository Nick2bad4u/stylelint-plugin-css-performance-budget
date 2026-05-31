# stylelint-plugin-css-performance-budget

[![CI](https://github.com/Nick2bad4u/stylelint-plugin-css-performance-budget/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/stylelint-plugin-css-performance-budget/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/stylelint-plugin-css-performance-budget.svg)](https://www.npmjs.com/package/stylelint-plugin-css-performance-budget)
[![codecov](https://codecov.io/gh/Nick2bad4u/stylelint-plugin-css-performance-budget/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/stylelint-plugin-css-performance-budget)

Stylelint rules and shareable configs for CSS performance budgets.

## Why this plugin

`stylelint-plugin-css-performance-budget` helps teams catch CSS patterns that commonly increase layout, paint, and compositing cost.

## Installation

```bash
npm install --save-dev stylelint stylelint-plugin-css-performance-budget
```

## Usage

```js
import { performanceBudgetPluginConfigs } from "stylelint-plugin-css-performance-budget";

export default performanceBudgetPluginConfigs["performance-budget-recommended"];
```

## Configs

- `performance-budget-recommended`
- `performance-budget-all`
- `performance-budget-strict`

## Rules

**Fix legend:**

- 🔧 = autofixable
- — = report only

**Preset key legend:**

- [🟢](./docs/rules/configs/performance-budget-recommended.md) — `performanceBudgetPluginConfigs["performance-budget-recommended"]`
- [🟣](./docs/rules/configs/performance-budget-all.md) — `performanceBudgetPluginConfigs["performance-budget-all"]`
- [🛡️](./docs/rules/configs/performance-budget-strict.md) — `performanceBudgetPluginConfigs["performance-budget-strict"]`

| Rule                                                                                                                                                                                 | Fix | Preset key                                                                                                                                                                | Description                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`no-excessive-filter-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-excessive-filter-effects)                                         |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii.                 |
| [`no-expensive-animation-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-animation-properties)                             |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn on `transition: all` and transitions or keyframes that target high-cost paint effects.                    |
| [`no-expensive-positioning-patterns`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-expensive-positioning-patterns)                             |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Warn when fixed or sticky positioned rules also apply expensive paint effects.                                 |
| [`no-fixed-background-attachment`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-fixed-background-attachment)                                   |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn on fixed background attachment patterns that commonly cause expensive scroll repaints.                    |
| [`no-giant-selector-lists`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-giant-selector-lists)                                                 |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Warn when one rule contains an oversized comma-separated selector list.                                        |
| [`no-global-expensive-effects`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-global-expensive-effects)                                         |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn when paint-heavy effects are applied to broad global selectors.                                           |
| [`no-heavy-selectors`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-heavy-selectors)                                                           |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Warn when selector complexity exceeds a configurable performance budget.                                       |
| [`no-layout-thrashing-properties`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-layout-thrashing-properties)                                   |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn when transitions or keyframes target layout-affecting properties.                                         |
| [`no-oversized-css-custom-property-values`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-oversized-css-custom-property-values)                 |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Warn when custom properties hide oversized shadow, filter, or gradient values.                                 |
| [`no-paint-heavy-declarations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-paint-heavy-declarations)                                         |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Warn on declarations whose values exceed paint/compositing budgets.                                            |
| [`no-render-blocking-import`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-render-blocking-import)                                             |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn on CSS `@import` rules that can block stylesheet rendering.                                               |
| [`no-will-change-abuse`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/no-will-change-abuse)                                                       |  —  | [🟢](./docs/rules/configs/performance-budget-recommended.md) [🛡️](./docs/rules/configs/performance-budget-strict.md) [🟣](./docs/rules/configs/performance-budget-all.md) | Warn when will-change is overly broad, uses risky keywords, or targets expensive properties.                   |
| [`require-reduced-motion-for-expensive-animations`](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/rules/require-reduced-motion-for-expensive-animations) |  —  | [🟣](./docs/rules/configs/performance-budget-all.md)                                                                                                                      | Require a `prefers-reduced-motion: reduce` override when expensive transition or keyframe properties are used. |

## License

MIT
