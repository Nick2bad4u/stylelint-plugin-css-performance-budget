---
title: no-paint-heavy-declarations
description: Warn on declarations that are typically expensive to paint.
---

# no-paint-heavy-declarations

Warn on paint-heavy declaration properties such as `box-shadow`, `filter`, and `backdrop-filter`.

## Rule options

```json
{
  "css-performance-budget/no-paint-heavy-declarations": [
    true,
    { "ignoreProperties": ["box-shadow"] }
  ]
}
```
