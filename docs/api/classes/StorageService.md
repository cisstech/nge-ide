---
title: StorageService
---
# StorageService

`class`

## `addPrefix()`

## Signature

```typescript
addPrefix(key: string): string
```

### Parameters

- `key` (`string`)

### Returns

`string`

## `clear()`

## Signature

```typescript
clear(): Observable<undefined>
```

### Returns

`Observable<undefined>`

## `get()`

## Signature

```typescript
get(key: string, defaultValue?: T): Observable<T>
```

### Parameters

- `key` (`string`)
- `defaultValue` (`T`)

### Returns

`Observable<T>`

## `getBoolean()`

## Signature

```typescript
getBoolean(key: string, defaultValue?: boolean): Observable<boolean | undefined>
```

### Parameters

- `key` (`string`)
- `defaultValue` (`boolean`)

### Returns

`Observable<boolean | undefined>`

## `getNumber()`

## Signature

```typescript
getNumber(key: string, defaultValue?: number): Observable<number | undefined>
```

### Parameters

- `key` (`string`)
- `defaultValue` (`number`)

### Returns

`Observable<number | undefined>`

## `getString()`

## Signature

```typescript
getString(key: string, defaultValue?: string): Observable<string | undefined>
```

### Parameters

- `key` (`string`)
- `defaultValue` (`string`)

### Returns

`Observable<string | undefined>`

## `remove()`

## Signature

```typescript
remove(key: string): Observable<undefined>
```

### Parameters

- `key` (`string`)

### Returns

`Observable<undefined>`

## `set()`

## Signature

```typescript
set(key: string, value: T): Observable<undefined>
```

### Parameters

- `key` (`string`)
- `value` (`T`)

### Returns

`Observable<undefined>`

## `watch()`

## Signature

```typescript
watch(key: string): Observable<T>
```

### Parameters

- `key` (`string`)

### Returns

`Observable<T>`
