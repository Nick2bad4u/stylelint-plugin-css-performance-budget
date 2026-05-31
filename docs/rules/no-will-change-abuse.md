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
| `maxProperties`         | `5`                                      | Allows broader reviewed hints while still catching unfocused target lists.            |

```json
{
 "css-performance-budget/no-will-change-abuse": [
  true,
  {
   "maxProperties": 5,
   "checkExpensiveTargets": true,
   "disallowKeywords": ["all", "contents", "scroll-position"],
   "ignoreProperties": ["background-position"]
  }
 ]
}
```
