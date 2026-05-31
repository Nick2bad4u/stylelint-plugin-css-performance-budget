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

| Option                  | Default                                  | Why                                                                                   |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `checkExpensiveTargets` | `true`                                   | `will-change` should not pre-promote expensive layout or paint properties by default. |
| `disallowKeywords`      | `["all", "contents", "scroll-position"]` | These keywords are too broad for production performance hints.                        |
| `ignoreProperties`      | `[]`                                     | Allows reviewed project-specific will-change targets.                                 |
| `maxProperties`         | `2`                                      | Keeps `will-change` focused on one or two concrete targets.                           |

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
