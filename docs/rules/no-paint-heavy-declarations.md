---
title: no-paint-heavy-declarations
description: Warn on declarations that exceed paint/compositing budgets.
---

# no-paint-heavy-declarations

Warn on paint-heavy declarations only when the value exceeds a concrete budget,
such as multi-layer shadows, large shadow blur radii, excessive filter stacks, or
large blur filters.

This rule intentionally allows ordinary component shadows and simple filters. If
the only signal is "this property can be expensive in some cases," the rule
stays quiet.

## Rule options

| Option                  | Default | Why                                                                          |
| ----------------------- | :-----: | ---------------------------------------------------------------------------- |
| `ignoreProperties`      |  `[]`   | Allows approved paint-heavy properties in audit profiles.                    |
| `maxFilterBlurRadiusPx` |  `30`   | Allows moderate static blur values and catches unusually large blur effects. |
| `maxFilterFunctions`    |   `4`   | Allows common static filter stacks and catches unusually long pipelines.     |
| `maxShadowBlurRadiusPx` |  `48`   | Allows larger component elevation but flags very large soft shadows.         |
| `maxShadowLayers`       |   `3`   | Allows layered component shadows while catching excessive paint stacks.      |

```json
{
 "css-performance-budget/no-paint-heavy-declarations": [
  true,
  {
   "ignoreProperties": ["box-shadow"],
   "maxFilterBlurRadiusPx": 30,
   "maxFilterFunctions": 4,
   "maxShadowBlurRadiusPx": 48,
   "maxShadowLayers": 3
  }
 ]
}
```
