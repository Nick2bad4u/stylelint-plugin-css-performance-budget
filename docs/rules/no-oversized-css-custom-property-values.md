---
title: no-oversized-css-custom-property-values
description: Warn when custom properties hide oversized rendering-cost values.
---

# no-oversized-css-custom-property-values

Warn when CSS custom properties hide large shadow, filter, blur, or gradient values that can later be reused widely.

## What this catches

- custom properties with too many expensive rendering functions
- shadow/filter/gradient token values with oversized comma-separated layer lists

## Rule options

```json
{
  "css-performance-budget/no-oversized-css-custom-property-values": [
    true,
    {
      "maxFunctions": 4,
      "maxListItems": 4
    }
  ]
}
```
