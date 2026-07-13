---
title: SearchComponent
---
# SearchComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `adapter (readonly)` | `ITreeAdapter<Node>` |  |
| `form` | `Required<SearchForm>` |  |
| `nodes` | `Node[]` |  |
| `pattern?` | `RegExp` |  |
| `searching` | `boolean` |  |
| `tree` | `ITree<Node>` |  |
| `isEmpty` | `unknown` |  |

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
ngOnInit(): Promise<void>
```

### Returns

`Promise<void>`

## `search()`

## Signature

```typescript
search(): Promise<void>
```

### Returns

`Promise<void>`
