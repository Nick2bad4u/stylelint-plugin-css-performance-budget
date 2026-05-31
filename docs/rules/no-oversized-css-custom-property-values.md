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

| Option         | Default | Why                                                                               |
| -------------- | :-----: | --------------------------------------------------------------------------------- |
| `maxFunctions` |   `4`   | Allows normal design tokens but catches tokens hiding large rendering pipelines.  |
| `maxListItems` |   `4`   | Allows normal layered tokens but catches large shadow, filter, or gradient lists. |

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
