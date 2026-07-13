---
title: IdeComponent
---
# IdeComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `animate (readonly)` | `WritableSignal<boolean>` | Enables the split transitions, but only from the first user interaction. The |
| `ready (readonly)` | `WritableSignal<boolean>` | Flips to `true` once IdeService.start has resolved. Until then a |
| `task?` | `ITask` |  |
| `theme (readonly)` | `Signal<ResolvedTheme>` | Resolved IDE theme ('light' \| 'dark'); drives the `data-theme` host attribute. |

## `ngOnDestroy()`

## Signature

```typescript
ngOnDestroy(): Promise<void>
```

### Returns

`Promise<void>`

## `ngOnInit()`

## Signature

```typescript
ngOnInit(): Promise<void>
```

### Returns

`Promise<void>`

## `onFirstInteraction()`

## Signature

```typescript
onFirstInteraction(): void
```

### Returns

`void`
