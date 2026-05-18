---
title: require-reduced-motion-for-expensive-animations
description: Require reduced-motion overrides for expensive transition and keyframe targets.
---

# require-reduced-motion-for-expensive-animations

Require a `prefers-reduced-motion: reduce` override when expensive transition or keyframe properties are used.

## What this catches

- layout or paint properties in `transition`
- `transition: all`
- expensive properties inside `@keyframes`

## Rule options

```json
{
  "css-performance-budget/require-reduced-motion-for-expensive-animations": [
    true,
    { "ignoreProperties": ["background-color"] }
  ]
}
```
