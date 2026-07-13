---
title: BadgeComponent
description: Projects arbitrary content and overlays a small count bubble at its
---
# BadgeComponent

`class`

Projects arbitrary content and overlays a small count bubble at its
top-right corner.

```html
<ide-badge [count]="notifications" [showZero]="false" [offset]="[0, 0]">
  <ui-icon icon="bell"></ui-icon>
</ide-badge>
```

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `count (readonly)` | `InputSignal<number>` | Value rendered inside the bubble. |
| `offset (readonly)` | `InputSignal<[number, number] | undefined>` | Pixel shift `[x, y]` from the default top-right anchor. |
| `right (readonly)` | `Signal<number | null>` | Right inset in pixels, or `null` to keep the default anchor. |
| `showZero (readonly)` | `InputSignal<boolean>` | Render the bubble even when the count is zero. |
| `top (readonly)` | `Signal<number | null>` | Top margin in pixels, or `null` to keep the default anchor. |
| `visible (readonly)` | `Signal<boolean>` | Whether the bubble is shown for the current count and `showZero` value. |
