---
title: ToolbarService
---
# ToolbarService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.toolbar-service"` | Unique identifier of the contribution. |

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `listButtons()`

## Signature

```typescript
listButtons(): Observable<IToolbarButton[]>
```

### Returns

`Observable<IToolbarButton[]>`

## `listCustomGroups()`

## Signature

```typescript
listCustomGroups(): Observable<IToolbarCustomGroup[]>
```

### Returns

`Observable<IToolbarCustomGroup[]>`

## `listOfGroup()`

## Signature

```typescript
listOfGroup(group: string): Observable<IToolbarItem[]>
```

### Parameters

- `group` (`string`)

### Returns

`Observable<IToolbarItem[]>`

## `register()`

## Signature

```typescript
register(...items: IToolbarItem[]): void
```

### Parameters

- `...items` (`IToolbarItem[]`)

### Returns

`void`

## `registerButton()`

## Signature

```typescript
registerButton(...buttons: IToolbarButton[]): void
```

### Parameters

- `...buttons` (`IToolbarButton[]`)

### Returns

`void`

## `registerGroup()`

## Signature

```typescript
registerGroup(...items: IToolbarCustomGroup[]): void
```

### Parameters

- `...items` (`IToolbarCustomGroup[]`)

### Returns

`void`
