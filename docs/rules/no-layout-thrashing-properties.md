---
title: no-layout-thrashing-properties
description: Warn when motion targets layout-affecting properties.
---

# no-layout-thrashing-properties

Warn when transitions or keyframes animate properties that force layout work, such as
`width`, `height`, `inset`, `top`, `left`, `margin`, or `padding`.

This rule intentionally does not report static layout declarations. A normal
`padding` or `width` declaration is not layout thrashing; the problem is making
the browser recalculate layout repeatedly during motion.

## Rule options

```json
{
 "css-performance-budget/no-layout-thrashing-properties": [
  true,
  {
   "checkKeyframes": true,
   "ignoreProperties": ["width"]
  }
 ]
}
```
