---
title: SidebarComponent
description: Renders on the sidebar area of the ide.
---
# SidebarComponent

`class`

Renders on the sidebar area of the ide.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `active?` | `SidebarContainer` | Current active container |
| `bottom` | `SidebarContainer[]` | Container aligned to the bottom of the activity bar |
| `role` | `string` |  |
| `side` | `"left" | "right"` | Horizontal position of the component in the app |
| `size` | `number` | Current size of the sidebar |
| `top` | `SidebarContainer[]` | Container aligned to the top of the activity bar |
| `isEmpty` | `unknown` |  |
| `storageId` | `unknown` |  |

## `isActive()`

## Signature

```typescript
isActive(view: SidebarContainer): boolean
```

### Parameters

- `view` (`SidebarContainer`) - The view to test.

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

## `reorder()`

## Signature

```typescript
reorder(event: CdkDragDrop<SidebarContainer[]>): void
```

### Parameters

- `event` (`CdkDragDrop<SidebarContainer[]>`)

### Returns

`void`

## `setActive()`

## Signature

```typescript
setActive(container: SidebarContainer, open?: boolean): Promise<void>
```

### Parameters

- `container` (`SidebarContainer`) - The view to activate.
- `open` (`boolean`) - Whether to open the sidebar if it is closed.

### Returns

`Promise<void>`

## `toggle()`

## Signature

```typescript
toggle(): void
```

### Returns

`void`
