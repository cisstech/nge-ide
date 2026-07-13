---
title: IdeAutocompleteDirective
description: Trigger that binds a native `<input>` (or `<textarea>`) to an
---
# IdeAutocompleteDirective

`class`

Trigger that binds a native `<input>` (or `<textarea>`) to an
`<ide-autocomplete>` panel, showing filtered options in a CDK overlay.

Replaces ng-zorro's `[nzAutocomplete]`. It is the input's
ControlValueAccessor, so it stays compatible with `formControl`,
`formControlName` and `[(ngModel)]`: typing pushes the raw text to the model
(the consumer filters on it) and picking an option pushes the option's
`value`, mirroring ng-zorro's behaviour.

Keyboard: ArrowUp/ArrowDown move the highlight (opening the panel if closed),
Enter selects the active option, Escape closes the panel. Navigation uses
`aria-activedescendant` so DOM focus never leaves the input.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `activeOptionId (readonly)` | `WritableSignal<string | null>` | Id of the active option, exposed through `aria-activedescendant`. |
| `panel?` | `IdeAutocompleteComponent` | Panel to open under the input (was `[nzAutocomplete]`). |
| `panelOpen (readonly)` | `WritableSignal<boolean>` | Whether the overlay is currently open. |

## `controlsId()`

## Signature

```typescript
controlsId(): string | null
```

### Returns

`string | null`

## `handleBlur()`

## Signature

```typescript
handleBlur(): void
```

### Returns

`void`

## `handleFocus()`

## Signature

```typescript
handleFocus(): void
```

### Returns

`void`

## `handleInput()`

## Signature

```typescript
handleInput(event: Event): void
```

### Parameters

- `event` (`Event`)

### Returns

`void`

## `handleKeydown()`

## Signature

```typescript
handleKeydown(event: Event): void
```

### Parameters

- `event` (`Event`)

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

## `writeValue()`

## Signature

```typescript
writeValue(value: unknown): void
```

### Parameters

- `value` (`unknown`)

### Returns

`void`
