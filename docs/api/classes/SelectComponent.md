---
title: SelectComponent
description: A compact, VS-Code-like single-select dropdown.
---
# SelectComponent

`class`

A compact, VS-Code-like single-select dropdown.

Replaces ng-zorro's `nz-select` / `nz-option` pairing. The trigger is a native
`<button>` that opens a `@angular/cdk/overlay` panel hosting a
`@angular/cdk/listbox`, which provides the roving-focus keyboard model
(arrows, `Home`/`End`, type-ahead, `Enter`/`Space` to commit). It implements
ControlValueAccessor, so it works with `[(ngModel)]`, `[ngModel]` +
`(ngModelChange)`, and reactive forms.

Options are declared as projected [OptionComponent](/docs/api/classes/OptionComponent) (`ide-option`)
children; this component reads their `value` / `label` through a content query
and renders the interactive rows itself inside the overlay.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `isDisabled (readonly)` | `WritableSignal<boolean>` | Whether the control is disabled (driven by reactive forms / `setDisabledState`). |
| `isOpen (readonly)` | `WritableSignal<boolean>` | Whether the dropdown overlay is open. |
| `listboxId (readonly)` | `string` | Id of the listbox panel, used to focus it once the overlay is attached. |
| `options (readonly)` | `Signal<readonly OptionComponent[]>` | Options declared as projected `ide-option` content. `descendants` is enabled |
| `overlayPanelClass (readonly)` | `Signal<string>` | IDE theme class stamped on the overlay panel so it renders under the right theme. |
| `overlayPositions (readonly)` | `ConnectedPosition[]` | Preferred dropdown positions: below the trigger, flipping above when cramped. |
| `panelWidth (readonly)` | `WritableSignal<number>` | Width applied to the overlay panel so it lines up with the trigger. |
| `selectedLabel (readonly)` | `Signal<string>` | Label shown in the trigger for the current selection. |
| `selectedValues (readonly)` | `Signal<readonly unknown[]>` | Selection expressed as the single-element array shape `cdkListbox` expects. |
| `triggerId (readonly)` | `string` | Id of the trigger, used to label the listbox for assistive technology. |

## `close()`

## Signature

```typescript
close(): void
```

### Returns

`void`

## `closeAndFocusTrigger()`

## Signature

```typescript
closeAndFocusTrigger(): void
```

### Returns

`void`

## `onOutsideClick()`

## Signature

```typescript
onOutsideClick(): void
```

### Returns

`void`

## `onOverlayAttached()`

## Signature

```typescript
onOverlayAttached(): void
```

### Returns

`void`

## `onOverlayKeydown()`

## Signature

```typescript
onOverlayKeydown(event: KeyboardEvent): void
```

### Parameters

- `event` (`KeyboardEvent`)

### Returns

`void`

## `onSelectionChange()`

## Signature

```typescript
onSelectionChange(event: ListboxValueChange): void
```

### Parameters

- `event` (`ListboxValueChange`)

### Returns

`void`

## `onTriggerKeydown()`

## Signature

```typescript
onTriggerKeydown(event: KeyboardEvent): void
```

### Parameters

- `event` (`KeyboardEvent`)

### Returns

`void`

## `open()`

## Signature

```typescript
open(): void
```

### Returns

`void`

## `registerOnChange()`

## Signature

```typescript
registerOnChange(fn: (value: unknown) => void): void
```

### Parameters

- `fn` (`(value: unknown) => void`) - The callback function to register

### Returns

`void`

## `registerOnTouched()`

## Signature

```typescript
registerOnTouched(fn: () => void): void
```

### Parameters

- `fn` (`() => void`) - The callback function to register

### Returns

`void`

## `setDisabledState()`

## Signature

```typescript
setDisabledState(isDisabled: boolean): void
```

### Parameters

- `isDisabled` (`boolean`) - The disabled status to set on the element

### Returns

`void`

## `toggle()`

## Signature

```typescript
toggle(): void
```

### Returns

`void`

## `writeValue()`

## Signature

```typescript
writeValue(value: unknown): void
```

### Parameters

- `value` (`unknown`)

### Returns

`void`
