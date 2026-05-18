---
title: no-will-change-abuse
description: Warn when will-change usage is too broad or targets expensive properties.
---

# no-will-change-abuse

Warn when `will-change` is used with broad keywords, too many targets, or expensive layout/paint targets.

## What this catches

- `will-change: all`
- `will-change` target lists larger than the configured budget
- expensive targets such as `width`, `height`, `filter`, and `box-shadow`

## Rule options

```json
{
  "css-performance-budget/no-will-change-abuse": [
    true,
    {
      "maxProperties": 2,
      "checkExpensiveTargets": true,
      "disallowKeywords": ["all", "contents", "scroll-position"],
      "ignoreProperties": ["background-position"]
    }
  ]
}
```
