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

```json
{
 "css-performance-budget/no-paint-heavy-declarations": [
  true,
  {
   "ignoreProperties": ["box-shadow"],
   "maxFilterBlurRadiusPx": 8,
   "maxFilterFunctions": 2,
   "maxShadowBlurRadiusPx": 24,
   "maxShadowLayers": 1
  }
 ]
}
```
