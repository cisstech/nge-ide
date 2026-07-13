---
title: Paths
---
# Paths

`class`

## `basename()`

## Signature

```typescript
basename(path: string): string
```

### Parameters

- `path` (`string`)

### Returns

`string`

## `dirname()`

## Signature

```typescript
dirname(path: string, normalize: boolean): string
```

### Parameters

- `path` (`string`) - the path to evaluate
- `normalize` (`boolean`)

### Returns

`string`

## `extname()`

## Signature

```typescript
extname(path: string): string
```

### Parameters

- `path` (`string`) - the path to evaluate

### Returns

`string`

## `isAbsolutePath()`

## Signature

```typescript
isAbsolutePath(path: string): boolean
```

### Parameters

- `path` (`string`)

### Returns

`boolean`

## `isBinaryFile()`

## Signature

```typescript
isBinaryFile(path: string): boolean
```

### Parameters

- `path` (`string`) - the path to test.

### Returns

`boolean`

## `join()`

## Signature

```typescript
join(parts: string[], sep: string, normalize: boolean): string
```

### Parameters

- `parts` (`string[]`)
- `sep` (`string`)
- `normalize` (`boolean`)

### Returns

`string`

## `normalize()`

## Signature

```typescript
normalize(path: string, stripTrailing: boolean): string
```

### Parameters

- `path` (`string`) - path to normalize
- `stripTrailing` (`boolean`) - remove trailing slashes

### Returns

`string`
