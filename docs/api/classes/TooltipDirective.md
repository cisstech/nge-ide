---
title: TooltipDirective
description: Attribute directive that shows a compact, VS-Code-like tooltip on hover and on
---
# TooltipDirective

`class`

Attribute directive that shows a compact, VS-Code-like tooltip on hover and on
keyboard focus, built on `@angular/cdk/overlay`. Drop-in replacement for
ng-zorro's `nz-tooltip`.

The directive value is the tooltip text (renamed from `nz-tooltip`); an empty
or whitespace-only value shows nothing. `ideTooltipPlacement` (renamed from
`nzTooltipPlacement`) accepts a single placement name (`top`, `bottomRight`,
...) or an ordered list used as preferred positions.

It hides on pointer leave, blur, `Escape` and on destroy, and wires
`aria-describedby` to the bubble while it is visible.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `placement (readonly)` | `InputSignal<string | string[]>` | Preferred placement: a single name (`top`, `bottom`, `left`, `right`, |
| `text (readonly)` | `InputSignal<string | null | undefined>` | Tooltip text; an empty or whitespace-only value shows nothing (replaces `nz-tooltip`). |

## `hide()`

## Signature

```typescript
hide(): void
```

### Returns

`void`

## `ngOnDestroy()`

## Signature

```typescript
ngOnDestroy(): void
```

### Returns

`void`

## `show()`

## Signature

```typescript
show(): void
```

### Returns

`void`
