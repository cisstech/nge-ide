---
title: IdeModalContainerComponent
description: Presentational container rendered inside the CDK dialog overlay. It lays out
---
# IdeModalContainerComponent

`class`

Presentational container rendered inside the CDK dialog overlay. It lays out
the modal chrome (header/title, body, footer) the way `nz-modal` does and
leaves opening, ESC/backdrop dismissal and result plumbing to
`IdeModalService`.

The body renders either a sanitized HTML string or an arbitrary component
(with its inputs populated from `componentParams`), mirroring ng-zorro's
`nzContent` + `nzComponentParams`.

It is instantiated by the CDK `Dialog` service, so it receives its data
through `DIALOG_DATA` and closes itself through the injected `DialogRef`
rather than through component inputs.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `componentContent (readonly)` | `Type<C> | null` | Component type to instantiate in the body, or `null` when the content is a string/empty. |
| `data (readonly)` | `IdeModalContainerData<C>` | Normalized options provided by `IdeModalService`. |
| `showHeader (readonly)` | `boolean` | Whether the header (title and/or close button) should be rendered. |
| `stringContent (readonly)` | `string | null` | HTML string to project into the body, or `null` when the content is a component/empty. |

## `onCloseClick()`

## Signature

```typescript
onCloseClick(): void
```

### Returns

`void`

## `onFooterClick()`

## Signature

```typescript
onFooterClick(button: IdeModalButton<C>): void
```

### Parameters

- `button` (`IdeModalButton<C>`)

### Returns

`void`
