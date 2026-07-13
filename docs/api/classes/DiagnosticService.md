---
title: DiagnosticService
---
# DiagnosticService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.diagnostic-service"` | Unique identifier of the contribution. |
| `count` | `unknown` |  |
| `errors` | `unknown` |  |
| `hints` | `unknown` |  |
| `infos` | `unknown` |  |
| `isEmpty` | `unknown` |  |
| `warnings` | `unknown` |  |

## `asObservable()`

## Signature

```typescript
asObservable(uri: Uri): Observable<Diagnostic[]>
```

### Parameters

- `uri` (`Uri`)

### Returns

`Observable<Diagnostic[]>`

## `asObservableAll()`

## Signature

```typescript
asObservableAll(): Observable<DiagnosticGroup[]>
```

### Returns

`Observable<DiagnosticGroup[]>`

## `clear()`

## Signature

```typescript
clear(): void
```

### Returns

`void`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `setDiagnostics()`

## Signature

```typescript
setDiagnostics(uri: Uri, items: Diagnostic[]): void
```

### Parameters

- `uri` (`Uri`)
- `items` (`Diagnostic[]`)

### Returns

`void`
