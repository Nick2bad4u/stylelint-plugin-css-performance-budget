---
title: no-layout-thrashing-properties
description: Warn on declarations that can trigger expensive layout recalculations.
---

# no-layout-thrashing-properties

Warn on properties commonly associated with layout thrashing and reflow-heavy updates.

## Rule options

```json
{
  "css-performance-budget/no-layout-thrashing-properties": [
    true,
    { "ignoreProperties": ["width"] }
  ]
}
```
