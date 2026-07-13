---
title: Diagnostic
description: Represents a diagnostic, such as a compiler error or warning.
---
# Diagnostic

`interface`

Represents a diagnostic, such as a compiler error or warning.
Diagnostic objects are only valid in the scope of a file.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `message` | `string` | The human-readable message. |
| `range` | `object` | The range to which this diagnostic applies. |
| `severity` | `DiagnosticSeverity` | The severity. |
