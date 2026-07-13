---
title: FileSystemError
description: A type that filesystem providers should use to signal errors.
---
# FileSystemError

`class`

A type that filesystem providers should use to signal errors.
This class has factory methods for common error-cases, like FileNotFound when a file or folder doesn't exist,

## `FileExists()`

## Signature

```typescript
FileExists(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`

## `FileIsADirectory()`

## Signature

```typescript
FileIsADirectory(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`

## `FileNotADirectory()`

## Signature

```typescript
FileNotADirectory(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`

## `FileNotFound()`

## Signature

```typescript
FileNotFound(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`

## `NoPermissions()`

## Signature

```typescript
NoPermissions(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`

## `Unavailable()`

## Signature

```typescript
Unavailable(messageOrUri?: string | Uri): FileSystemError
```

### Parameters

- `messageOrUri` (`string | Uri`) - Message or uri.

### Returns

`FileSystemError`
