---
title: SettingsService
---
# SettingsService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.settings-service"` | Unique identifier of the contribution. |
| `onDidChange (readonly)` | `Observable<Record<string, Setting[]>>` |  |

## `activate()`

## Signature

```typescript
activate(): Promise<void>
```

### Returns

`Promise<void>`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `extract()`

## Signature

```typescript
extract(groupName: string): object
```

### Parameters

- `groupName` (`string`)

### Returns

`object`

## `get()`

## Signature

```typescript
get(groupName: string, settingName: string): Setting | undefined
```

### Parameters

- `groupName` (`string`)
- `settingName` (`string`)

### Returns

`Setting | undefined`

## `getAll()`

## Signature

```typescript
getAll(): Record<string, Settings.Setting[]>
```

### Returns

`Record<string, Settings.Setting[]>`

## `ofGroup()`

## Signature

```typescript
ofGroup(groupName: string): Setting[]
```

### Parameters

- `groupName` (`string`)

### Returns

`Setting[]`

## `register()`

## Signature

```typescript
register(value: Setting): void
```

### Parameters

- `value` (`Setting`)

### Returns

`void`

## `save()`

## Signature

```typescript
save(): void
```

### Returns

`void`

## `set()`

## Signature

```typescript
set(groupName: string, settingName: string, value: any): void
```

### Parameters

- `groupName` (`string`)
- `settingName` (`string`)
- `value` (`any`)

### Returns

`void`

## `update()`

## Signature

```typescript
update(groups: Group[]): void
```

### Parameters

- `groups` (`Group[]`)

### Returns

`void`
