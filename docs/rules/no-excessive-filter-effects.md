---
title: no-excessive-filter-effects
description: Warn on heavy filter/backdrop-filter stacks and blur radii.
---

# no-excessive-filter-effects

Warn when `filter` and `backdrop-filter` values exceed safe function or blur thresholds.

## Rule options

```json
{
 "css-performance-budget/no-excessive-filter-effects": [
  true,
  { "maxFunctions": 2, "maxBlurRadiusPx": 8 }
 ]
}
```
