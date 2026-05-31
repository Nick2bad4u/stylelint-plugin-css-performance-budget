---
title: Getting Started
description: Install and use stylelint-plugin-css-performance-budget in an ESM Stylelint config.
---

# Getting Started

## Install

```bash
npm install --save-dev stylelint stylelint-plugin-css-performance-budget
```

## Use the 🟢 recommended config

```js
import { performanceBudgetPluginConfigs } from "stylelint-plugin-css-performance-budget";

export default performanceBudgetPluginConfigs["performance-budget-recommended"];
```

See [🟢 performance-budget-recommended](./configs/performance-budget-recommended.md)
for the exact rule list, or compare all profiles in the
[config matrix](./configs/index.md#Config-Matrix).

## Use plugin + explicit rules

```js
import performanceBudgetPlugin from "stylelint-plugin-css-performance-budget";

export default {
 plugins: [...performanceBudgetPlugin],
 rules: {
  "css-performance-budget/no-layout-thrashing-properties": true,
  "css-performance-budget/no-paint-heavy-declarations": true,
 },
};
```

## Next Steps

- Review the [rule overview](./overview.md) for the full catalog.
- Compare [🟢 recommended, 🛡️ strict, and 🟣 all configs](./configs/index.md).
- Use [developer docs](https://nick2bad4u.github.io/stylelint-plugin-css-performance-budget/docs/developer) when changing package exports or generated docs surfaces.
