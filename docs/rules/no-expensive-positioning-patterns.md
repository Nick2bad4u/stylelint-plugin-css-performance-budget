---
title: no-expensive-positioning-patterns
description: Warn when fixed or sticky positioned rules also apply expensive paint effects.
---

# no-expensive-positioning-patterns

Warn when `position: fixed` or `position: sticky` appears in the same rule as expensive paint effects.

## What this catches

- fixed overlays with `backdrop-filter`
- sticky headers with large `box-shadow`
- fixed elements with `filter` or `clip-path`

## Rule options

| Option             | Default               | Why                                                               |
| ------------------ | --------------------- | ----------------------------------------------------------------- |
| `ignoreProperties` | `[]`                  | Allows deliberate fixed or sticky paint effects after review.     |
| `positions`        | `["fixed", "sticky"]` | Fixed and sticky layers are more likely to repaint during scroll. |

```json
{
 "css-performance-budget/no-expensive-positioning-patterns": [
  true,
  {
   "positions": ["fixed", "sticky"],
   "ignoreProperties": ["box-shadow"]
  }
 ]
}
```
