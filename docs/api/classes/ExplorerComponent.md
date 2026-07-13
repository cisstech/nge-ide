---
title: ExplorerComponent
---
# ExplorerComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `adapter (readonly)` | `ITreeAdapter<IFile>` |  |
| `commands (readonly)` | `BehaviorSubject<IExplorerCommand[][]>` |  |
| `menu` | `TemplateRef<unknown>` |  |
| `root (readonly)` | `Observable<IFile[]>` |  |
| `tree` | `TreeComponent<IFile>` |  |

## `closeContextMenu()`

## Signature

```typescript
closeContextMenu(): void
```

### Returns

`void`

## `ngAfterViewChecked()`

## Signature

```typescript
ngAfterViewChecked(): void
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

## `ngOnInit()`

## Signature

```typescript
ngOnInit(): void
```

### Returns

`void`

## `onDropped()`

## Signature

```typescript
onDropped(e: DndData): Promise<void>
```

### Parameters

- `e` (`DndData`) - the dropped data.

### Returns

`Promise<void>`
