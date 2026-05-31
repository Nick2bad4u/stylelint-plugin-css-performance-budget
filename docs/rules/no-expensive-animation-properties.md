---
title: no-expensive-animation-properties
description: Warn on expensive transition and keyframe property targets.
---

# no-expensive-animation-properties

Warn when transitions or keyframes use high-cost motion patterns:
`transition: all`, high-cost paint targets such as `clip-path`, oversized
shadow/filter values, or large paint effects inside keyframes.

## What this catches

- `transition: all` by default
- transitions of explicitly high-cost paint/compositing targets
- oversized `box-shadow`, `text-shadow`, `filter`, or `backdrop-filter` values
  when the value is available in the same rule or keyframe

This rule intentionally does not report common low-cost UI transitions such as
`background-color`, and it does not report every `box-shadow` or `filter`
transition without value evidence.

## Rule options

```json
{
 "css-performance-budget/no-expensive-animation-properties": [
  true,
  {
   "allowTransitionAll": false,
   "checkKeyframes": true,
   "ignoreProperties": ["box-shadow"],
   "maxFilterBlurRadiusPx": 8,
   "maxFilterFunctions": 2,
   "maxShadowBlurRadiusPx": 24,
   "maxShadowLayers": 1
  }
 ]
}
```
