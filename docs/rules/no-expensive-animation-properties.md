---
title: no-expensive-animation-properties
description: Warn on expensive transition and keyframe property targets.
---

# no-expensive-animation-properties

Warn when transitions or keyframes target properties that are typically expensive for layout or paint.

## What this catches

- `transition: all` by default
- expensive properties in `transition` / `transition-property`
- expensive properties animated inside `@keyframes`

## Rule options

```json
{
  "css-performance-budget/no-expensive-animation-properties": [
    true,
    {
      "allowTransitionAll": false,
      "checkKeyframes": true,
      "ignoreProperties": ["background-color"]
    }
  ]
}
```
