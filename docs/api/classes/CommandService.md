---
title: CommandService
---
# CommandService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.commands"` | Unique identifier of the contribution. |

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `execute()`

## Signature

```typescript
execute(id: string): Promise<void>
```

### Parameters

- `id` (`string`) - A command identifier.

### Returns

`Promise<void>`

## `find()`

## Signature

```typescript
find(id: string | Type<ICommand>): T
```

### Parameters

- `id` (`string | Type<ICommand>`)

### Returns

`T`

## `findAll()`

## Signature

```typescript
findAll(predicate: (command: ICommand) => boolean): Observable<T[]>
```

### Parameters

- `predicate` (`(command: ICommand) => boolean`) - A predicate function that returns true if the command should be returned.

### Returns

`Observable<T[]>`

## `findAllByPrefix()`

## Signature

```typescript
findAllByPrefix(prefix: string): Observable<T[]>
```

### Parameters

- `prefix` (`string`) - Prefix to search for.

### Returns

`Observable<T[]>`

## `onAfterExecute()`

## Signature

```typescript
onAfterExecute(commandId?: string): Observable<CommandEvent>
```

### Parameters

- `commandId` (`string`) - Identifier of the command to listen to.

### Returns

`Observable<CommandEvent>`

## `onBeforeExecute()`

## Signature

```typescript
onBeforeExecute(commandId?: string): Observable<CommandEvent>
```

### Parameters

- `commandId` (`string`) - Identifier of the command to listen to.

### Returns

`Observable<CommandEvent>`

## `register()`

## Signature

```typescript
register(...commands: (ICommand | Type<ICommand>)[]): void
```

### Parameters

- `...commands` (`(ICommand | Type<ICommand>)[]`) - The commands to register.

### Returns

`void`
