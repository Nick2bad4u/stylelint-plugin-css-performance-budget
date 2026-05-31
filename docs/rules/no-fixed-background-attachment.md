---
title: no-fixed-background-attachment
description: Warn on fixed background attachment patterns that cause scroll repaint cost.
---

# no-fixed-background-attachment

Warn when `background-attachment: fixed` is used directly or through the `background` shorthand.

## What this catches

- `background-attachment: fixed`
- `background: url(hero.jpg) center / cover fixed`

## Rule options

```json
{
 "css-performance-budget/no-fixed-background-attachment": true
}
```
