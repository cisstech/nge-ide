---
title: CheckboxComponent
description: A compact, VS-Code-like checkbox built on a native `<input type="checkbox">`.
---
# CheckboxComponent

`class`

A compact, VS-Code-like checkbox built on a native `<input type="checkbox">`.

Replaces ng-zorro's `nz-checkbox`. It implements ControlValueAccessor
so it works with `[(ngModel)]` (and reactive forms), projects its label text
through `<ng-content>`, and exposes a `checkedChange` output (renamed from
`nzCheckedChange`).

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `checked (readonly)` | `WritableSignal<boolean>` | Current checked state (source of truth for the view). |
| `checkedChange (readonly)` | `EventEmitter<boolean>` | Emits the new checked value whenever the user toggles the checkbox. |
| `focusedByKeyboard (readonly)` | `WritableSignal<boolean>` | True only when focus arrived via the keyboard, so a focus ring is shown. |
| `inputId (readonly)` | `string` | Unique id shared between the native input (allows external `<label for>` if ever needed). |
| `isDisabled (readonly)` | `WritableSignal<boolean>` | Whether the control is disabled (driven by the input or by reactive forms). |
| `disabled` | `unknown` |  |

## `handleChange()`

## Signature

```typescript
handleChange(event: Event): void
```

### Parameters

- `event` (`Event`)

### Returns

`void`

## `ngAfterViewInit()`

## Signature

```typescript
ngAfterViewInit(): void
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

## `registerOnChange()`

## Signature

```typescript
registerOnChange(fn: (value: boolean) => void): void
```

### Parameters

- `fn` (`(value: boolean) => void`) - The callback function to register

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

## `writeValue()`

## Signature

```typescript
writeValue(value: unknown): void
```

### Parameters

- `value` (`unknown`)

### Returns

`void`
