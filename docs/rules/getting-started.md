---
title: Getting Started
description: Install and use stylelint-plugin-css-performance-budget in an ESM Stylelint config.
---

# Getting Started

## Install

```bash
npm install --save-dev stylelint stylelint-plugin-css-performance-budget
```

## Use the recommended config

```js
import { performanceBudgetPluginConfigs } from "stylelint-plugin-css-performance-budget";

export default performanceBudgetPluginConfigs["performance-budget-recommended"];
```

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
