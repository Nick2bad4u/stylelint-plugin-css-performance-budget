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

| Option             | Default | Why                                                                      |
| ------------------ | :-----: | ------------------------------------------------------------------------ |
| `ignoreProperties` |  `[]`   | Allows explicit exceptions where a project has reviewed motion behavior. |

```json
{
 "css-performance-budget/require-reduced-motion-for-expensive-animations": [
  true,
  { "ignoreProperties": ["background-color"] }
 ]
}
```
