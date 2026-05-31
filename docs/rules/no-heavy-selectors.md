---
title: no-heavy-selectors
description: Warn when selector complexity exceeds a configurable budget.
---

# no-heavy-selectors

Warn when selector complexity is above a configurable threshold.

## Rule options

| Option          | Default | Why                                                                      |
| --------------- | :-----: | ------------------------------------------------------------------------ |
| `maxComplexity` |   `8`   | Allows normal component selectors while catching deep chained selectors. |

```json
{
 "css-performance-budget/no-heavy-selectors": [true, { "maxComplexity": 8 }]
}
```
