---
title: IdeAutoOptionComponent
description: A single selectable row inside an `<ide-autocomplete>` panel.
---
# IdeAutoOptionComponent

`class`

A single selectable row inside an `<ide-autocomplete>` panel.

Replaces ng-zorro's `nz-auto-option`. `value` (was `nzValue`) is the data
carried by the option and surfaced through the panel's `selectionChange`,
while `label` (was `nzLabel`) is the text written into the trigger input once
the option is picked. When `label` is omitted the projected text content is
used instead.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `active (readonly)` | `WritableSignal<boolean>` | Whether the option is currently highlighted by keyboard navigation. |
| `disabled` | `boolean` | Whether the option can be selected. |
| `id (readonly)` | `string` | Stable id used by the trigger for `aria-activedescendant`. |
| `label?` | `string` | Text shown in the trigger input once the option is picked (was `nzLabel`). |
| `selectionChange (readonly)` | `EventEmitter<IdeAutoOptionSelectionEvent>` | Emits when the user picks this option. |
| `value` | `any` | Data carried by the option, surfaced through the panel's `selectionChange` |

## `getLabel()`

## Signature

```typescript
getLabel(): string
```

### Returns

`string`

## `preventBlur()`

## Signature

```typescript
preventBlur(event: Event): void
```

### Parameters

- `event` (`Event`)

### Returns

`void`

## `scrollIntoViewIfNeeded()`

## Signature

```typescript
scrollIntoViewIfNeeded(): void
```

### Returns

`void`

## `selectViaInteraction()`

## Signature

```typescript
selectViaInteraction(): void
```

### Returns

`void`

## `setActiveStyles()`

## Signature

```typescript
setActiveStyles(): void
```

### Returns

`void`

## `setInactiveStyles()`

## Signature

```typescript
setInactiveStyles(): void
```

### Returns

`void`
