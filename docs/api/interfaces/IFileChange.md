---
title: IFileChange
description: Identifies a single change in a file.
---
# IFileChange

`interface`

Identifies a single change in a file.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `type (readonly)` | `FileChangeType` | The type of change that occurred to the file. |
| `uri (readonly)` | `Uri` | The unified resource identifier of the file that changed. |
