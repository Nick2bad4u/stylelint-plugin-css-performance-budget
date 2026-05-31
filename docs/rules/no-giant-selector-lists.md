---
title: no-giant-selector-lists
description: Warn on oversized selector lists.
---

# no-giant-selector-lists

Warn when a rule has too many comma-separated selectors.

## Rule options

| Option         | Default | Why                                                                |
| -------------- | :-----: | ------------------------------------------------------------------ |
| `maxSelectors` |   `4`   | Allows small grouped selectors but flags oversized selector lists. |

```json
{
 "css-performance-budget/no-giant-selector-lists": [true, { "maxSelectors": 4 }]
}
```
