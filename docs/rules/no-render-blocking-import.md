---
title: no-render-blocking-import
description: Warn on CSS imports that can block stylesheet rendering.
---

# no-render-blocking-import

Warn on CSS `@import` rules that can delay stylesheet discovery and rendering.

## What this catches

- `@import url("theme.css")`
- `@import "layout.css"`
- optional layered imports when `allowLayerImports` is not enabled

## Rule options

```json
{
  "css-performance-budget/no-render-blocking-import": [
    true,
    {
      "allowLayerImports": false,
      "ignoreUrls": ["fonts.googleapis.com"]
    }
  ]
}
```
