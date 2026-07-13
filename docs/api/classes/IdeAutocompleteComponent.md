---
title: IdeAutocompleteComponent
description: Floating list of `<ide-auto-option>` items shown under an input by the
---
# IdeAutocompleteComponent

`class`

Floating list of `<ide-auto-option>` items shown under an input by the
`[ideAutocomplete]` trigger.

Replaces ng-zorro's `nz-autocomplete`. Reference it with a template variable
and hand it to the trigger:

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `ariaLabel?` | `string` | Accessible name for the listbox. |
| `backfill` | `boolean` | Previews the highlighted option in the input while navigating (was `nzBackfill`). |
| `id (readonly)` | `string` | Id of the listbox element, referenced by the trigger's `aria-controls`. |
| `keyManager?` | `ActiveDescendantKeyManager<IdeAutoOptionComponent>` | Keyboard navigation manager over options. |
| `options (readonly)` | `QueryList<IdeAutoOptionComponent>` | Options projected by the consumer. |
| `selectionChange (readonly)` | `EventEmitter<IdeAutoOptionComponent>` | Emits the chosen option; read `$event.value` (was `nzValue`). |
| `showPanel (readonly)` | `WritableSignal<boolean>` | Whether there is at least one option to display. |
| `template (readonly)` | `TemplateRef<unknown>` | Template stamped into the CDK overlay by the trigger. |
| `optionSelectionChanges` | `unknown` |  |

## `emitSelectionChange()`

## Signature

```typescript
emitSelectionChange(option: IdeAutoOptionComponent): void
```

### Parameters

- `option` (`IdeAutoOptionComponent`)

### Returns

`void`

## `ngAfterContentInit()`

## Signature

```typescript
ngAfterContentInit(): void
```

### Returns

`void`
