---
title: no-excessive-filter-effects
description: Warn on heavy filter/backdrop-filter stacks and blur radii.
---

# no-excessive-filter-effects

Warn when `filter` and `backdrop-filter` values exceed safe function or blur thresholds.

## Rule options

| Option            | Default | Why                                                                                            |
| ----------------- | :-----: | ---------------------------------------------------------------------------------------------- |
| `maxBlurRadiusPx` |   `8`   | Flags expensive `blur()` and `drop-shadow()` blur radii while allowing small visual softening. |
| `maxFunctions`    |   `2`   | Allows common filter pairs and catches long filter stacks.                                     |

```json
{
 "css-performance-budget/no-excessive-filter-effects": [
  true,
  { "maxFunctions": 2, "maxBlurRadiusPx": 8 }
 ]
}
```
