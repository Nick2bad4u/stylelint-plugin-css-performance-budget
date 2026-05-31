---
title: no-excessive-filter-effects
description: Warn on heavy filter/backdrop-filter stacks and blur radii.
---

# no-excessive-filter-effects

Warn when `filter` and `backdrop-filter` values exceed safe function or blur thresholds.

## Rule options

| Option            | Default | Why                                                                         |
| ----------------- | :-----: | --------------------------------------------------------------------------- |
| `maxBlurRadiusPx` |  `30`   | Allows moderate visual softening and catches unusually large blur effects.  |
| `maxFunctions`    |   `4`   | Allows common filter stacks and catches unusually long rendering pipelines. |

```json
{
 "css-performance-budget/no-excessive-filter-effects": [
  true,
  { "maxFunctions": 4, "maxBlurRadiusPx": 30 }
 ]
}
```
