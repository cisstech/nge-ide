---
title: WorkbenchComponent
---
# WorkbenchComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `commands (readonly)` | `Observable<ICommand[]>` |  |
| `empty` | `boolean` |  |
| `groups (readonly)` | `Observable<EditorGroup[]>` |  |

## `isActiveGroup()`

## Signature

```typescript
isActiveGroup(group: EditorGroup): boolean
```

### Parameters

- `group` (`EditorGroup`)

### Returns

`boolean`

## `ngOnDestroy()`

## Signature

```typescript
ngOnDestroy(): void
```

### Returns

`void`

## `ngOnInit()`

## Signature

```typescript
ngOnInit(): void
```

### Returns

`void`

## `setActiveGroup()`

## Signature

```typescript
setActiveGroup(group: EditorGroup): void
```

### Parameters

- `group` (`EditorGroup`)

### Returns

`void`

## `trackGroup()`

## Signature

```typescript
trackGroup(_: number, item: EditorGroup): string
```

### Parameters

- `_` (`number`)
- `item` (`EditorGroup`)

### Returns

`string`

## `trackTab()`

## Signature

```typescript
trackTab(_: number, item: EditorTab): string
```

### Parameters

- `_` (`number`)
- `item` (`EditorTab`)

### Returns

`string`
