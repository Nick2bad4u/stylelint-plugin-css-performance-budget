---
title: no-global-expensive-effects
description: Warn when expensive paint effects are applied to broad global selectors.
---

# no-global-expensive-effects

Warn when broad selectors such as `*`, `html`, `body`, or `:root` apply paint-heavy effects.

## What this catches

- `body { filter: blur(2px); }`
- `* { box-shadow: 0 8px 24px black; }`
- `:root { backdrop-filter: blur(10px); }`

## Rule options

```json
{
  "css-performance-budget/no-global-expensive-effects": [
    true,
    { "ignoreProperties": ["text-shadow"] }
  ]
}
```
