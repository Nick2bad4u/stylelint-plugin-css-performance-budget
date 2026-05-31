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

| Option                  | Default | Why                                                                              |
| ----------------------- | :-----: | -------------------------------------------------------------------------------- |
| `allowTransitionAll`    | `false` | `transition: all` hides future expensive targets and should be explicit.         |
| `checkKeyframes`        | `true`  | Keyframes can force paint or compositing work on every animation frame.          |
| `ignoreProperties`      |  `[]`   | Provides a project escape hatch for approved transition or keyframe targets.     |
| `maxFilterBlurRadiusPx` |  `30`   | Allows moderate animated blur values and catches unusually large blur effects.   |
| `maxFilterFunctions`    |   `4`   | Allows common animated filter stacks and catches unusually long pipelines.       |
| `maxShadowBlurRadiusPx` |  `48`   | Allows larger component elevation but flags very large animated shadows.         |
| `maxShadowLayers`       |   `3`   | Allows layered component shadows while catching excessive animated paint stacks. |

```json
{
 "css-performance-budget/no-expensive-animation-properties": [
  true,
  {
   "allowTransitionAll": false,
   "checkKeyframes": true,
   "ignoreProperties": ["box-shadow"],
   "maxFilterBlurRadiusPx": 30,
   "maxFilterFunctions": 4,
   "maxShadowBlurRadiusPx": 48,
   "maxShadowLayers": 3
  }
 ]
}
```
